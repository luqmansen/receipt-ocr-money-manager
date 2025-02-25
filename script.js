const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const resultDiv = document.getElementById('result');
const logDiv = document.getElementById('log');
const pdfImagesDiv = document.getElementById('pdf-images');
const structuredDataDiv = document.getElementById('structured-data');
const tsvOutputDiv = document.getElementById('tsv-data');
const downloadButton = document.getElementById('download-tsv');

const {pdfjsLib} = globalThis;
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';

const scheduler = new Tesseract.createScheduler();

const worker1 = await Tesseract.createWorker('swe', 1, {
    langPath: 'https://tessdata.projectnaptha.com/4.0.0_best/',
    logger: m => log(`Tesseract worker 1: ${m.status} (${(m.progress * 100).toFixed(2)}%)`)
});
const worker2 = await Tesseract.createWorker('swe', 1, {
    langPath: 'https://tessdata.projectnaptha.com/4.0.0_best/',
    logger: m => log(`Tesseract worker 2: ${m.status} (${(m.progress * 100).toFixed(2)}%)`)
});
const worker3 = await Tesseract.createWorker('swe', 1, {
    langPath: 'https://tessdata.projectnaptha.com/4.0.0_best/',
    logger: m => log(`Tesseract worker 3: ${m.status} (${(m.progress * 100).toFixed(2)}%)`)
});

scheduler.addWorker(worker1);
scheduler.addWorker(worker2);
scheduler.addWorker(worker3);


function log(message) {
    const timestamp = new Date().toISOString();
    logDiv.innerHTML += `[${timestamp}] ${message}\n`;
    logDiv.scrollTop = logDiv.scrollHeight;
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

async function processFiles(file) {
    let allText = '';
    let imageBlob = file;

    if (file.type === 'application/pdf') {
        log(`Processing PDF: ${file.name}`);
        imageBlob = await convertPdfToImage(file);
    } else if (!file.type.startsWith('image/')) {
        alert('file type not supported');
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(imageBlob);
    img.className = 'pdf-image';
    pdfImagesDiv.appendChild(img);

    log('Starting Tesseract.js recognition');
    const result = await scheduler.addJob('recognize', imageBlob);
    log('Tesseract.js recognition completed');
    allText += result.data.text + '\n\n';

    const ocrResult = document.createElement('p');
    ocrResult.textContent = allText;
    resultDiv.appendChild(ocrResult);
    log(`Total OCR result length: ${allText.length} characters`);

    return allText;
}

function parseLidlOcrResult(text) {
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
                    const discount = parseFloat(discountMatch[1].replace(',', '.'));
                    currentItem.price -= discount;
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
    const date = new Date(dateString);
    return {
        transaction_date: date.toISOString(), items: items
    };
}

function parseWillysOcrResult(ocrText) {
    let items = [];
    let transactionDate = '';

    const lines = ocrText.trim().split('\n');
    const itemRegex = /^(.+)\s(\d+,\d{2})$/; // item name and non-negative price
    const discountRegex = /-\d+,\d+/; //negative price
    const dateRegex = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})$/;
    const endOfItemsRegex = /^Totalt.*/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const itemMatch = line.match(itemRegex);
        const discountMatch = line.match(discountRegex);
        const endOfItemsMatch = line.match(endOfItemsRegex);

        if (endOfItemsMatch) {
            break;
        }

        if (itemMatch) {
            items.push({
                name: itemMatch[1].trim(), price: parseFloat(itemMatch[2].replace(',', '.'))
            });
        } else if (discountMatch) {
            // subtract the discount from previous item
            items[items.length - 1].price += parseFloat(discountMatch[0].replace(',', '.'));
        }
    }
    const dateMatch = lines[lines.length - 1].match(dateRegex);
    if (dateMatch) {
        transactionDate = new Date(dateMatch[1]);
    } else {
        log('Date not found in the OCR text');
    }

    // validate the total price
    const totalPriceRegex = /Totalt ([\d,]+) SEK/
    log('Checking total price');
    const amountMatch = ocrText.match(totalPriceRegex);
    const totalAmount = amountMatch ? amountMatch[1] : null;
    log(`Total amount: ${totalAmount}`);

    if (totalAmount) {
        const calculatedTotal = items.reduce((acc, item) => acc + item.price, 0);
        if (calculatedTotal.toFixed(2) !== parseFloat(totalAmount.replace(',', '.')).toFixed(2)) {
            log(`Total amount mismatch: expected ${totalAmount}, got ${calculatedTotal.toFixed(2)}`);
        }
    }

    // normalize all prices to 2 decimal places
    items = items.map(item => {
        return {name: item.name, price: item.price.toFixed(2)};
    });

    return {
        transaction_date: transactionDate, items: items,
    };
}

function structureData(ocrText) {
    const willysRegex = /Willys/;
    const lidlRegex = /lidl.se/;

    if (ocrText.match(willysRegex)) {
        return parseWillysOcrResult(ocrText);
    } else if (ocrText.match(lidlRegex)) {
        return parseLidlOcrResult(ocrText);
    } else {
        return {error: 'Unknown store'};
    }
}

async function fetchExchangeRate() {
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

// Run the function on script load and store the result in a variable
let exchangeRate;
(async () => {
    exchangeRate = await fetchExchangeRate();
    console.log('Exchange rate:', exchangeRate);
})();


function convertPriceToIdr(price) {
    return price * exchangeRate;
}

function inferCategoryFromName(name) {
    return 'food'; // todo: implement a real category inference
}

function outputMoneyManagerFormat(data) {
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

    const {transaction_date, items} = data;
    const formattedDate = transaction_date.toISOString().split('T')[0].split('-').reverse().join('/');
    const output = items.map(item => {
        const idrAmount = convertPriceToIdr(item.price).toFixed(2);
        const category = inferCategoryFromName(item.name);
        const subcategory = category; // todo: implement a real subcategory inference
        return `${formattedDate}\tCash\t${category}\t${subcategory}\t${item.name}\t${idrAmount}\tExpense\t${item.extraInfo || ''}\t${item.price}\tSEK`;
    });

    const header = `Date\tAccount\tCategory\tSubcategory\tNote\tAmount\tIncome/Expense\tDescription\tAmountSub\tCurrency`;
    return header + '\n' + output.join('\n');
}

function downloadTsv(content, filename) {
    const contentType = 'text/tab-separated-values'
    const blob = new Blob([content], {type: contentType});
    const url = URL.createObjectURL(blob);

    const pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultDiv.textContent = '';
    pdfImagesDiv.innerHTML = '';
    const files = fileInput.files;

    if (!files.length > 0) {
        log('No files selected for processing');
        return;
    }

    try {
        let json_results = [];

        const ocrResults = await Promise.all(Array.from(files).map(async (file) => {
            return await processFiles(file);
        }));

        for (const ocr of ocrResults) {
            const structuredData = structureData(ocr);
            json_results.push(structuredData);
        }

        structuredDataDiv.textContent = JSON.stringify(json_results, null, 2);
        log('formatting data for Money Manager');
        tsvOutputDiv.textContent = json_results.map(outputMoneyManagerFormat).join('\n\n');

        downloadButton.addEventListener('click', () => {
            downloadTsv(tsvOutputDiv.textContent, 'money-manager-export.tsv');
        });

    } catch (error) {
        log(`Error processing files: ${error.message}`);
        resultDiv.textContent = 'Error processing files: ' + error.message;
    } finally {
        log('Processing completed');
        await scheduler.terminate();
    }
});

log('Page loaded and ready');
