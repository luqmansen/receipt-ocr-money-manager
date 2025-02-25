const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const resultDiv = document.getElementById('result');
const logDiv = document.getElementById('log');
const pdfImagesDiv = document.getElementById('pdf-images');
const structuredDataDiv = document.getElementById('structured-data');

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
    const result = await scheduler.addJob('recognize',  imageBlob);
    log('Tesseract.js recognition completed');
    allText += result.data.text + '\n\n';

    const ocrResult = document.createElement('p');
    ocrResult.textContent = allText;
    resultDiv.appendChild(ocrResult);
    log(`Total OCR result length: ${allText.length} characters`);

    return allText;
}

function parseLidlOCRResult(text) {
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
        return parseLidlOCRResult(ocrText);
    } else {
        return {error: 'Unknown store'};
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultDiv.textContent = '';
    pdfImagesDiv.innerHTML = '';
    const files = fileInput.files;

    if (files.length > 0) {
        try {
            let json_results = [];

            const ocrResults = await Promise.all(
                Array.from(files).map(async (file) => {
                    return await processFiles(file);}
            ));

            for (const ocr of ocrResults) {
                const structuredData = structureData(ocr);
                json_results.push(structuredData);
            }

            structuredDataDiv.textContent = JSON.stringify(json_results, null, 2);
            log('Data structuring completed');
        } catch (error) {
            log(`Error processing files: ${error.message}`);
            resultDiv.textContent = 'Error processing files: ' + error.message;
        }
    } else {
        log('No files selected for processing');
    }
});

log('Page loaded and ready');
