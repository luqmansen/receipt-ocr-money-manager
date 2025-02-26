import * as fuzz from 'fuzzball';
import {createScheduler, createWorker} from "tesseract.js";
import {categories} from './dictionary.js';
import Snowball from "snowball";

// apparently stemming doesn't always yield the best results
const stem = Snowball('swedish');


// Create a preprocessed category map
export const preprocessedCategories = {};
for (const [category, terms] of Object.entries(categories)) {
	try {
		preprocessedCategories[category] = terms.map(term => {
			// stemmer.setCurrent(normalized);
			// stemmer.stem();
			// return stemmer.getCurrent();
			try {
				return normalize(term.toLowerCase());
			} catch (error) {
				console.error('Error preprocessing term:', error, term);
				throw Error('Error preprocessing term: ' + term);
			}
		});
	} catch (error) {
		console.error('Error preprocessing category:', error, category);
		throw Error('Error preprocessing category: ' + category);
	}
}

function normalize(text) {
	return text.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

function preprocess(text) {
	return normalize(text);
}

export function addSubCategory(item, debug = false) {

	let debugMatches = [];

	const options = {scorer: fuzz.token_set_ratio};
	const processedItem = preprocess(item.name);
	let bestMatch = {category: '', score: 0};
	for (const [category, choices] of Object.entries(preprocessedCategories)) {
		const results = fuzz.extract(processedItem, choices, options);
		results.sort((a, b) => b[1] - a[1]);

		if (results[0][1] > bestMatch.score) {
			bestMatch = {category, match: results[0][0], score: results[0][1]};
		}
		if (debug) {
			debugMatches.push({category, match: results[0][0], score: results[0][1]});
		}

	}

	if (debug) {
		debugMatches = debugMatches.sort((a, b) => b.score - a.score).slice(0, 5);
		return {...item, subCategory: bestMatch.category, bestMatch, debugMatches};
	}

	return {...item, subCategory: bestMatch.category, bestMatch};
}

export async function getExchangeRate() {
	const localStorageKey = 'exchangeRate';
	const defaultExchangeRate = 1500;
	const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

	// Check if the exchange rate is in local storage and still valid
	const cachedRate = localStorage.getItem(localStorageKey);
	if (cachedRate) {
		const {rate, timestamp} = JSON.parse(cachedRate);
		if (Date.now() - timestamp < oneDay) {
			return rate;
		}
	}

	// Fetch the exchange rate from the API
	try {
		const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/sek.json');
		const data = await response.json();
		const exchangeRate = data.sek.idr;

		// Store the exchange rate in local storage with a timestamp
		localStorage.setItem(localStorageKey, JSON.stringify({rate: exchangeRate, timestamp: Date.now()}));
		return exchangeRate;
	} catch (error) {
		console.error('Error fetching exchange rate:', error);
		return defaultExchangeRate;
	}
}

async function convertPriceToIdr(price) {
	const exchangeRate = await getExchangeRate();
	return price * exchangeRate;
}

function inferCategoryFromName(name) {
	// (later) implement a real category inference
	// most of the items are likely food for now.
	return 'Food';
}

export function enrichItems(results) {
	return results.map(transaction => {
		let {transaction_date, items} = transaction;
		items = items.map((item) => {
			const category = inferCategoryFromName(item.name);
			item = addSubCategory(item);
			return {...item, category};
		})
		return {transaction_date, items}
	});
}

export async function outputMoneyManagerFormat(results) {
	/*
	Money manager backup format consist of tsv format with the following columns:

	```
	Date|Account|Category|Subcategory|Note|Amount|Income/Expense|Description|AmountSub|Currency
	```

	- Date is in the format of dd/mm/yyyy
	- Account is always `Cash`
	- Category is inferred from the item name
	- Subcategory is also inferred from the item name
	- Note is the item name
	- Amount is converted to my main account currency, which is IDR
	- Income/Expense is always `Expense`
	- Description is the item name
	- AmountSub is the price of the item in SEK
	- Currency is hardcoded to SEK for now
	*/

	let final_data = []

	for (const data of results) {
		const {transaction_date, items} = data;
		const formattedDate = transaction_date.split('-').reverse().join('/');
		const output = await Promise.all(items.map(async item => {
			const idrAmount = (await convertPriceToIdr(item.price)).toFixed(2);
			const dump = JSON.stringify(item.bestMatch);
			const extraInfo = item.extraInfo ? item.extraInfo + '\n' + dump : dump;
			return `${formattedDate}\tCash\t${item.category}\t${item.subCategory}\t${item.name}\t${idrAmount}\tExpense\t${extraInfo}\t${item.price}\tSEK`;
		}));
		final_data = final_data.concat(output);
	}

	const header = "Date\tAccount\tCategory\tSubcategory\tNote\tAmount\tIncome/Expense\tDescription\tAmountSub\tCurrency";
	return header + '\n' + final_data.join("\n");
}

export function tsvToTable(tsv) {
	const rows = tsv.split('\n').map(row => row.split('\t'));
	const header = rows.shift();
	const table = document.createElement('table');
	const thead = document.createElement('thead');
	const tbody = document.createElement('tbody');

	const headerRow = document.createElement('tr');
	for (const cell of header) {
		const th = document.createElement('th');
		th.textContent = cell;
		headerRow.appendChild(th);
	}
	thead.appendChild(headerRow);

	for (const row of rows) {
		const tr = document.createElement('tr');
		for (const cell of row) {
			const td = document.createElement('td');
			td.textContent = cell;
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}

	table.appendChild(thead);
	table.appendChild(tbody);
	return table;
}

export function downloadTsv(content, filename) {
	const contentType = 'text/tab-separated-values'
	const blob = new Blob([content], {type: contentType});
	const url = URL.createObjectURL(blob);

	const pom = document.createElement('a');
	pom.href = url;
	pom.setAttribute('download', filename);
	pom.click();
}

export const resultDiv = document.getElementById('result');
const logDiv = document.getElementById('log');
export const pdfImagesDiv = document.getElementById('pdf-images');
export const scheduler = createScheduler();

export async function prepareWorker(num) {
	return await createWorker('swe', 1, {
		langPath: 'https://tessdata.projectnaptha.com/4.0.0_best/',
		logger: m => log(`Tesseract worker ${num}: ${m.status} (${(m.progress * 100).toFixed(2)}%)`)
	}).then(worker => {
		scheduler.addWorker(worker);
	});
}

export function log(message) {
	const timestamp = new Date().toISOString();
	try {
		logDiv.innerHTML += `[${timestamp}] ${message}\n`;
		logDiv.scrollTop = logDiv.scrollHeight;
	} catch (error) {
	}
	console.log(`[${timestamp}] ${message}`);
}

async function convertPdfToImage(pdfFile) {
	log(`Starting PDF to image conversion for ${pdfFile.name}`);
	const arrayBuffer = await pdfFile.arrayBuffer();
	const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
	log(`PDF loaded, number of pages: ${pdf.numPages}`);

	const page = await pdf.getPage(1);
	const scale = 1.5;
	const viewport = page.getViewport({scale});

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.height = viewport.height;
	canvas.width = viewport.width;

	const renderContext = {
		canvasContext: context, viewport: viewport
	};

	log('Rendering PDF page to canvas');
	await page.render(renderContext).promise;
	log('PDF page rendered to canvas');

	return new Promise((resolve) => {
		canvas.toBlob((blob) => {
			log('Canvas converted to blob');
			resolve(blob);
		}, 'image/png');
	});
}

export async function processFiles(file) {
	let allText = '';
	let imageBlob = file;

	if (file.type === 'application/pdf') {
		log(`Processing PDF: ${file.name}`);
		imageBlob = await convertPdfToImage(file);
	} else if (!file.type.startsWith('image/')) {
		alert('file type not supported: ' + file.type);
	}

	const img = document.createElement('img');
	img.src = URL.createObjectURL(imageBlob);
	img.className = 'pdf-image';
	pdfImagesDiv.appendChild(img);

	log(`Starting Tesseract.js recognition for file ${file.name}`);
	const result = await scheduler.addJob('recognize', imageBlob);
	log('Tesseract.js recognition completed');
	allText += result.data.text + '\n\n';

	const ocrResult = document.createElement('p');
	ocrResult.textContent = allText;
	resultDiv.appendChild(ocrResult);
	log(`Total OCR result length: ${allText.length} characters`);

	return allText;
}

export function parseLidlOcrResult(text) {
	const lines = text.split('\n');
	let items = [];
	let currentItem = null;
	let i = 0;

	while (i < lines.length) {
		const line = lines[i].trim();
		const priceMatch = line.match(/(\d+[.,]\d+)\s*C$/);

		if (priceMatch) {
			if (currentItem) {
				items.push(currentItem);
			}

			const price = parseFloat(priceMatch[1].replace(',', '.'));
			const name = line.substring(0, line.indexOf(priceMatch[1])).trim();
			currentItem = {name, price, extraInfo: ''};

			// Look for discounts or extra info in the next lines
			let j = i + 1;
			while (j < lines.length) {
				const nextLine = lines[j].trim();
				const discountMatch = nextLine.match(/-(\d+[.,]\d+)/);

				if (discountMatch) {
					// Add the discount as a separate item so we can track how much we saved
					items.push({
						name: currentItem.name + ' (discount)',
						price: -parseFloat(discountMatch[1].replace(',', '.'))
					})
				} else if (nextLine.includes('SEK/kg')) {
					currentItem.extraInfo = nextLine;
				} else if (nextLine.match(/(\d+[.,]\d+)\s*C$/)) {
					// Next item found, break the inner loop
					break;
				}
				j++;
			}
			i = j - 1; // Set the outer loop to continue from where we left off
		}
		i++;
	}

	// Add the last item if exists
	if (currentItem) {
		items.push(currentItem);
	}

	const dateRegex = /\d{4}\/\d{2}\/\d{2}/;
	const match = text.match(dateRegex);
	if (!match) {
		log('Date not found in the OCR text');
	}

	// normalize all prices to 2 decimal places
	items = items.map(item => {
		return {name: item.name, price: item.price.toFixed(2)};
	});

	const dateString = match[0];
	// Note: JavaScript interprets date strings in UTC by default
	const date = (new Date(dateString)).toLocaleDateString('sv-SE');
	return {
		transaction_date: date, items: items
	};
}

export function parseWillysOcrResult(ocrText) {
	/*
	1.Find the line containing `Gäller inte` or `och frysvaror`, as this is usually the header of the receipt,
	using or in case of the entire string not being read correctly by the OCR.
	2. Identify the next line as the starting item.
	3. Identify the first line containing `Totalt` as the end item.
	4. Extract items between these two anchors, using the number format \d+,\d{2} as anchors for item names.
	 */
	let items = [];
	let transactionDate = '';

	const lines = ocrText.trim().split('\n');
	const itemStartRegex = /Gäller inte|och frysvaror/;
	const itemEndRegex = /^Totalt/;
	const priceRegex = /-?\d+,\d{2}$/;

	let startIndex = -1;
	let endIndex = -1;

	// Find the start and end indices
	for (let i = 0; i < lines.length; i++) {
		if (itemStartRegex.test(lines[i])) {
			startIndex = i + 1;
		}
		if (itemEndRegex.test(lines[i])) {
			endIndex = i;
			break;
		}
	}

	if (startIndex === -1 || endIndex === -1) {
		return {error: 'Unable to find item start or end'};
	}

	// Extract items between startIndex and endIndex
	let currentItem = '';
	for (let i = startIndex; i < endIndex; i++) {
		const line = lines[i].trim();
		if (priceRegex.test(line)) {
			const priceMatch = line.match(priceRegex);
			const price = parseFloat(priceMatch[0].replace(',', '.'));

			name = (currentItem.trim() + ' ' + line.substring(0, line.indexOf(priceMatch[0])).trim()).trim();


			// name sanitization
			// remove `willys Plus:` from the name
			name = name.replace('willys Plus:', '');
			//match one or more word that contains (kg, st, G,L ) AND digits
			const extraInfoMatch = Array.from(name.matchAll(/(\b(?=\S*(kg|st|G|L))(?=\S*\d)\S+\b)/g));


			for (const match of extraInfoMatch) {
				name = name.replace(match[0], '').trim();
			}
			const extraInfo = extraInfoMatch.reduce(
				(acc, curr) => {
					return acc + ' ' + curr[0];
				}, '').trim();


			if (price < 0) {
				// Discount item, use previous item name
				name = items[items.length - 1].name + ' (discount)';
			}

			items.push({name, price, extraInfoMatch: extraInfoMatch ? extraInfo : ''});
			currentItem = '';
		} else {
			currentItem += ' ' + line;
		}
	}

	const dateRegex = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
	const dateMatch = lines[lines.length - 1].match(dateRegex);
	if (dateMatch) {
		transactionDate = (new Date(dateMatch[0])).toLocaleDateString('sv-SE');
	} else {
		log('Date not found in the OCR text');
		transactionDate = 'Unknown';
	}

	// Normalize all prices to 2 decimal places
	items = items.map(item => {
		return {...item, price: item.price.toFixed(2)};
	});

	return {
		transaction_date: transactionDate,
		items: items,
	};
}

export function parseOCR(ocrText) {
	const willysRegex = /willys/;
	const lidlRegex = /lidl.se/;

	if (ocrText.match(willysRegex)) {
		return parseWillysOcrResult(ocrText);
	} else if (ocrText.match(lidlRegex)) {
		return parseLidlOcrResult(ocrText);
	} else {
		return {error: 'Unknown store'};
	}
}
