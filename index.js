import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import {
	downloadTsv,
	enrichItems,
	outputMoneyManagerFormat,
	tsvToTable,
	log,
	pdfImagesDiv,
	prepareWorker,
	processFiles,
	resultDiv,
	scheduler,
	parseOCR
} from "./script";


const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const structuredDataDiv = document.getElementById('structured-data');
const tsvOutputDiv = document.getElementById('tsv-data');
const downloadButton = document.getElementById('download-tsv');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';

(async () => {
	return await prepareWorker(1)
})();

(async () => {
	return await prepareWorker(2)
})();


form.addEventListener('submit', async (e) => {
	e.preventDefault();
	resultDiv.textContent = '';
	pdfImagesDiv.innerHTML = '';
	const files = fileInput.files;

	if (!files.length > 0) {
		log('No files selected for processing');
		return;
	}

	let json_results = [];

	const futures = Array.from(files).map(async (file) => {
		return await processFiles(file);
	});
	const ocrResults = await Promise.all(futures);

	for (const ocr of ocrResults) {
		const structuredData = parseOCR(ocr);
		json_results.push(structuredData);
	}
	// show intermediate results
	structuredDataDiv.textContent = JSON.stringify(json_results, null, 2);

	json_results = enrichItems(json_results);
	// show final results
	structuredDataDiv.textContent = JSON.stringify(json_results, null, 2);

	log('formatting data for Money Manager');
	const tsv = await outputMoneyManagerFormat(json_results);
	tsvOutputDiv.appendChild(tsvToTable(tsv))

	downloadButton.addEventListener('click', () => {
		downloadTsv(tsv, 'money-manager-export.tsv');
	});

	log('Processing completed');
});

window.onbeforeunload = beforeUnloadHandler;

async function beforeUnloadHandler(event) {
	event.preventDefault();
	await scheduler.terminate();
	event.returnValue = true;

}

log('Page loaded and ready');

