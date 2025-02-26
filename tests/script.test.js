import {expect, test} from 'vitest'
import {
	addSubCategory,
	enrichItems,
	outputMoneyManagerFormat,
	parseWillysOcrResult,
	parseOCR
} from "../script";

test('addSubCategory', () => {
	expect(addSubCategory(
		{
			"name": "SHOT INGEF/GURKM",
			"price": "43.90"
		}
	)).toStrictEqual(
		{
			"bestMatch": {
				"category": "Beverages",
				"match": "shot ingef/gurkm",
				"score": 100,
			},
			"name": "SHOT INGEF/GURKM",
			"price": "43.90",
			"subCategory": "Beverages",
		}
	)
})

// test('enrichItems', () => {
//     let items = [
//         {
//             "transaction_date": "2025-02-14T14:11:00.000Z",
//             "items": [
//                 {
//                     "name": "SHOT INGEF/GURKM",
//                     "price": "43.90"
//                 },
//                 {
//                     "name": "ÖVERLÅR KYCKLING 2st49,90",
//                     "price": "99.80"
//                 },
//                 {
//                     "name": "GORGONZOLA",
//                     "price": "29.90"
//                 },
//                 {
//                     "name": "BONDBÖNOR 450G",
//                     "price": "24.90"
//                 },
//                 {
//                     "name": "BROCCOLI",
//                     "price": "9.90"
//                 },
//                 {
//                     "name": "JORDGUBBAR 250G 3st+44,90",
//                     "price": "59.70"
//                 }
//             ]
//         }
//     ]
//
//     expect(enrichItems(items)).toStrictEqual(
//         [
//             {
//                 "transaction_date": new Date("2025-02-14T14:11:00.000Z"),
//                 "items": [
//                     {
//                         "name": "SHOT INGEF/GURKM",
//                         "price": "43.90",
//                         "category": "Fruits & Vegetables",
//                         "sub_category": "food"
//                     },
//                     {
//                         "name": "ÖVERLÅR KYCKLING 2st49,90",
//                         "price": "99.80",
//                         "category": "Meat & Seafood",
//                         "sub_category": "Poultry"
//                     },
//                     {
//                         "name": "GORGONZOLA",
//                         "price": "29.90",
//                         "category": "Dairy & Eggs",
//                         "sub_category": "Cheese"
//                     },
//                     {
//                         "name": "BONDBÖNOR 450G",
//                         "price": "24.90",
//                         "category": "Pantry Staples",
//                         "sub_category": "Grains & Pasta"
//                     },
//                     {
//                         "name": "BROCCOLI",
//                         "price": "9.90",
//                         "category": "Fruits & Vegetables",
//                         "sub_category": "Vegetables"
//                     },
//                     {
//                         "name": "JORDGUBBAR 250G 3st+44,90",
//                         "price": "59.70",
//                         "category": "Fruits & Vegetables",
//                         "sub_category": "Fruits"
//                     }
//                 ]
//             }
//         ]
//     )
// })

test('parseWillysOcr', () => {
	const text = `
    Fridhemsplan
Tfn: 08-420 03 380
- Org: 556163-2232
Öppet köp i 8 dagar med kvitto
Gäller inte kyl- och frysvaror
KYCKLING FILÉ 69,90
CHOKL MANGO&PASSION 22,90
OLIVOLJA 105,00
NÖTMIX SALTY 200G 25,90
LIBANESISKT BRÖD 11,90
RÖDA LINSER EKO 29,90
POTATIS SÖT 41,32
STANDMJÖLK ESL 1,5L 19,50
SALLADSOST 2st17,90 35,80
Willys Plus:SALLADSOST -10,80
KANELSNÄCKA 4st9,90 39,60
Nytt pris 15,00 -24,60
SURKÅL EKO 16,90
KYCKLINGKÖTTBULLAR 49,90
Rabatt :KÖTTBULLAR -15,00
Totalt 16 varor
Totalt — 418,12 SEK
Låga priser på allt. Alltid.
Med Willys Plus har du sparat: 10,80
willys Plus registrerat
willys Plus-nummer: 9752299071199367
Mottaget Kontokort 418,12
Ref:200244238433
Nordea Debit PEPPPPPENEE7556
KÖP 418.12 SEK
Butik:”=+0777
Ref: 200244238433 Term: 20024423
TVR: 0900000000 AID: A0000000031010
2025-02-22 13:30:50 TSI: 0000
Kontaktlös KA1 7 001 SWE 532942
Moms5s Moms Netto Brutto
12,00 44,81 373,31 418,12
SPARA KVITTOT
Öppettider
Alla dagar 07-22
välkommen åter!
Du betjänades av
Självcheckout Kassör
Kassa: 28/64 2025-02-22 13:30
    `


	expect(enrichItems([parseWillysOcrResult(text)])).toStrictEqual(
		[
			{
				"transaction_date": "2025-02-22", // locale sv-SE string format
				"items": [
					{
						"name": "KYCKLING FILÉ",
						"price": "69.90",
						"subCategory": "Protein",
						"bestMatch": {
							"category": "Protein",
							"match": "kyckling",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "CHOKL MANGO&PASSION",
						"price": "22.90",
						"subCategory": "Fruit",
						"bestMatch": {
							"category": "Fruit",
							"match": "mango",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "OLIVOLJA",
						"price": "105.00",
						"subCategory": "Food Supplies",
						"bestMatch": {
							"category": "Food Supplies",
							"match": "olivolja",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "NÖTMIX SALTY 200G",
						"price": "25.90",
						"subCategory": "Snacking",
						"bestMatch": {
							"category": "Snacking",
							"match": "notskalsost",
							"score": 50
						},
						"category": "Food"
					},
					{
						"name": "LIBANESISKT BRÖD",
						"price": "11.90",
						"subCategory": "Bread",
						"bestMatch": {
							"category": "Bread",
							"match": "brod",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "RÖDA LINSER EKO",
						"price": "29.90",
						"subCategory": "Food Supplies",
						"bestMatch": {
							"category": "Food Supplies",
							"match": "linser",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "POTATIS SÖT",
						"price": "41.32",
						"subCategory": "Veggies",
						"bestMatch": {
							"category": "Veggies",
							"match": "potatis",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "STANDMJÖLK ESL 1,5L",
						"price": "19.50",
						"subCategory": "Beverages",
						"bestMatch": {
							"category": "Beverages",
							"match": "standardmjolk",
							"score": 63
						},
						"category": "Food"
					},
					{
						"name": "SALLADSOST 2st17,90",
						"price": "35.80",
						"subCategory": "Snacking",
						"bestMatch": {
							"category": "Snacking",
							"match": "hushallsost",
							"score": 53
						},
						"category": "Food"
					},
					{
						"name": "SALLADSOST 2st17,90 (discount)",
						"price": "-10.80",
						"subCategory": "Snacking",
						"bestMatch": {
							"category": "Snacking",
							"match": "hushallsost",
							"score": 46
						},
						"category": "Food"
					},
					{
						"name": "KANELSNÄCKA 4st9,90",
						"price": "39.60",
						"subCategory": "Snacking",
						"bestMatch": {
							"category": "Snacking",
							"match": "kanelsnacka",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "KANELSNÄCKA 4st9,90 (discount)",
						"price": "-24.60",
						"subCategory": "Snacking",
						"bestMatch": {
							"category": "Snacking",
							"match": "kanelsnacka",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "SURKÅL EKO",
						"price": "16.90",
						"subCategory": "Food Supplies",
						"bestMatch": {
							"category": "Food Supplies",
							"match": "surkal",
							"score": 100
						},
						"category": "Food"
					},
					{
						"name": "KYCKLINGKÖTTBULLAR",
						"price": "49.90",
						"subCategory": "Protein",
						"bestMatch": {
							"category": "Protein",
							"match": "kycklinglar",
							"score": 76
						},
						"category": "Food"
					},
					{
						"name": "KYCKLINGKÖTTBULLAR (discount)",
						"price": "-15.00",
						"subCategory": "Protein",
						"bestMatch": {
							"category": "Protein",
							"match": "kycklinglar",
							"score": 58
						},
						"category": "Food"
					}
				]
			}
		]
	)

})

test('outputMoneyManagerFormat', async () => {
	const items = [
		{
			"transaction_date": new Date("2025-02-14T14:11:00.000Z").toLocaleDateString('sv-SE'),
			"items": [
				{
					"name": "SHOT INGEF/GURKM",
					"price": "43.90",
					"subCategory": "beverage",
					"bestMatch": {
						"category": "beverage",
						"match": "SHOT INGEF/GURKM",
						"score": 100
					},
					"category": "food"
				},
				{
					"name": "ÖVERLÅR KYCKLING 2st49,90",
					"price": "99.80",
					"subCategory": "protein",
					"bestMatch": {
						"category": "protein",
						"match": "kyckling",
						"score": 100
					},
					"category": "food"
				},
				{
					"name": "GORGONZOLA",
					"price": "29.90",
					"subCategory": "snack",
					"bestMatch": {
						"category": "snack",
						"match": "GORGONZOLA",
						"score": 100
					},
					"category": "food"
				},
				{
					"name": "BONDBÖNOR 450G",
					"price": "24.90",
					"subCategory": "vegetable",
					"bestMatch": {
						"category": "vegetable",
						"match": "bonor",
						"score": 53
					},
					"category": "food"
				},
				{
					"name": "BROCCOLI",
					"price": "9.90",
					"subCategory": "vegetable",
					"bestMatch": {
						"category": "vegetable",
						"match": "broccoli",
						"score": 100
					},
					"category": "food"
				},
				{
					"name": "JORDGUBBAR 250G 3st+44,90",
					"price": "59.70",
					"subCategory": "fruit",
					"bestMatch": {
						"category": "fruit",
						"match": "jordgubbar",
						"score": 100
					},
					"category": "food"
				}
			]
		}
	]

	expect(await outputMoneyManagerFormat(items)).toStrictEqual(
		`Date\tAccount\tCategory\tSubcategory\tNote\tAmount\tIncome/Expense\tDescription\tAmountSub\tCurrency
14/02/2025\tCash\tfood\tbeverage\tSHOT INGEF/GURKM\t66564.06\tExpense\t{"category":"beverage","match":"SHOT INGEF/GURKM","score":100}\t43.90\tSEK
14/02/2025\tCash\tfood\tprotein\tÖVERLÅR KYCKLING 2st49,90\t151323.32\tExpense\t{"category":"protein","match":"kyckling","score":100}\t99.80\tSEK
14/02/2025\tCash\tfood\tsnack\tGORGONZOLA\t45336.34\tExpense\t{"category":"snack","match":"GORGONZOLA","score":100}\t29.90\tSEK
14/02/2025\tCash\tfood\tvegetable\tBONDBÖNOR 450G\t37755.02\tExpense\t{"category":"vegetable","match":"bonor","score":53}\t24.90\tSEK
14/02/2025\tCash\tfood\tvegetable\tBROCCOLI\t15011.03\tExpense\t{"category":"vegetable","match":"broccoli","score":100}\t9.90\tSEK
14/02/2025\tCash\tfood\tfruit\tJORDGUBBAR 250G 3st+44,90\t90521.06\tExpense\t{"category":"fruit","match":"jordgubbar","score":100}\t59.70\tSEK`)
})


test('structureData', () => {
	const texts = [
		`Fridhemsplan
Tfn: 08-420 03 380
- Org: 556163-2232
Öppet köp i 8 dagar med kvitto
Gäller inte kyl- och frysvaror
SHOT INGEF/GURKM 43,90
ÖVERLÅR KYCKLING 2st49,90 99,80
GORGONZOLA 29,90
BONDBÖNOR 450G 24,90
BROCCOLI 15,90
Rabatt :BROCCOLI -6,00
JORDGUBBAR 250G 3st+44,90 134,70
3 + Willys Plus:JORDGUBBAR -75,00
Totalt 9 varor
Totalt — 268,10 SEK
Låga priser på allt. Alltid.
Med Willys Plus har du sparat: 75,00
willys Plus registrerat
willys Plus-nummer: 9752299071199367
Mottaget Kontokort 268,10
Ref:200244219967
Nordea Debit PEPPEPPEEEE7556
KÖP 268.1 SEK
Butik:”=+0777
Ref: 200244219967 Term: 20024421
TVR: 0900000000 AID: A0000000031010
2025-02-14 15:11:51 TSI: 0000
Kontaktlös K/1 7 001 SWE 806421
Moms5s Moms Netto Brutto
12,00 28,72 239,38 268,10
SPARA KVITTOT
Öppettider
Alla dagar 07-22
välkommen åter!
Du betjänades av
Självcheckout Kassör
Kassa: 31/70 2025-02-14 15:11`,
		`Fridhemsplan
Tfn: 08-420 03 380
Org: 556163-2232
Öppet köp i 8 dagar med kvitto
Gäller inte kyl- och frysvaror
KNÄCKEBRÖD 550G 22,50
LAMMFRAMDEL MB
willys Plus:
2,360kg+129,00kr/kg 304,44
Rabatt:79,90 KR/KG MAX 3 -115,88
LAMMFRAMDEL MB
willys Plus:
2,318kg+129,00kr/kg 299,02
Rabatt:79,90 KR/KG MAX 3 -113,81
KYCKLINGKÖTTBULLAR 49,90
Rabatt :KÖTTBULLAR -15,00
ÄGG 15P INNE MEDIUM 39,90
Rabatt: ÄGG 15P -7,00
LIBANESISKT BRÖD 11,90
SMÖR NORMSALTAT 500G 65,90
Rabatt:SMÖR -13,00
SCHWEIZERNÖT 150G 3st19,90 59,70
TOMATER BABYPLOMMON 17,90
MANDELSEMLA 2-P 29,90
Totalt 12 varor
Totalt — 636,37 SEK
Låga priser på allt. Alltid.
willys Plus registrerat
willys Plus-nummer: 9752299071199367
Mottaget Kontokort 636,37
Ref:200244297191
Visa KRRARARRARARTESG
KÖP 636.37 SEK
Butik:”=+0777
Ref: 200244297191 Term: 20024429
TVR: 0900000000 AID: A0000000031010
2025-02-09 13:33:44 TSI: 0000
Kontaktlös KAL 7 001 SWE 393797
Moms5s Moms Netto Brutto
12,00 68,19 568,18 636,37
SPARA KVITTOT
Öppettider
Alla dagar 07-22
välkommen åter!
Du betjänades av
Självcheckout Kassör
Kassa: 26/81 2025-02-09 13:33`,

		`Fridhemsplan
Tfn: 08-420 03 380
Org: 556163-2232
Öppet köp i 8 dagar med kvitto
Gäller inte kyl- och frysvaror
FUSILLI 2st"9,90 19,80
Rabatt:PASTA -3,80
MOZZARELLA MAXI 34,90
STANDMJÖLK ESL 1,5L 19,50
BROCCOLIMIX 21,90
SCHWEIZERNÖT 150G 2st"19,90 39,80
MJÖLKCHOKLAD 150G 19,90
KYCKLINGKLUBBA 2st”49,90 99,80
RÄKOR SKALADE 400G 58,90
GRILLKRYDDA 100G 17,90
PITABRÖD UVS 360G 11,90
TOMAT BABYPLOMMON 48,90
Rabatt: BABYPLOMMONTOMATER -29,00
LÖKPULVER 80G 17,90
APELSIN RÖD 32,90
Rabatt:APELSIN RÖD -13,00
GUL LÖK 17,90
Rabatt:GUL LÖK -8,00
SALLADSMIX EKO 5,90
VANILJSNÄCKA 4st"9,90 39,60
Nytt pris 12,50 -27,10
VANILJSNÄCKA 4st"9,90 39,60
Nytt pris 12,50 -27,10
Totalt 26 varor
Totalt 439,00 SEK
Låga priser på allt. Alltid.
willys Plus registrerat
willys Plus-nummer: 9752299071199367
Mottaget Kontokort 439,00
Ref:200244218204
Nordea Debit PEPPEPPEEEE7556
KÖP 439.0 SEK
Butik:”=+0777
Ref: 200244218204 Term: 20024421
TVR: 0900000000 AID: A0000000031010
2025-02-01 14:58:53 TSI: 0000
Kontaktlös KA1 7 001 SWE 743388
Moms5s Moms Netto Brutto
12,00 47,03 391,97 439,00
SPARA KVITTOT
Öppettider
Alla dagar 07-22
välkommen åter!
Du betjänades av
Självcheckout Kassör
Kassa: 31/21 2025-02-01 14:58`,


		`Fridhemsplan
Tfn: 08-420 03 380
- Org: 556163-2232
Öppet köp i 8 dagar med kvitto
Gäller inte kyl- och frysvaror
KYCKLING FILÉ 69,90
CHOKL MANGO&PASSION 22,90
OLIVOLJA 105,00
NÖTMIX SALTY 200G 25,90
LIBANESISKT BRÖD 11,90
RÖDA LINSER EKO 29,90
POTATIS SÖT 41,32
STANDMJÖLK ESL 1,5L 19,50
SALLADSOST 2st17,90 35,80
Willys Plus:SALLADSOST -10,80
KANELSNÄCKA 4st9,90 39,60
Nytt pris 15,00 -24,60
SURKÅL EKO 16,90
KYCKLINGKÖTTBULLAR 49,90
Rabatt :KÖTTBULLAR -15,00
Totalt 16 varor
Totalt — 418,12 SEK
Låga priser på allt. Alltid.
Med Willys Plus har du sparat: 10,80
willys Plus registrerat
willys Plus-nummer: 9752299071199367
Mottaget Kontokort 418,12
Ref:200244238433
Nordea Debit PEPPPPPENEE7556
KÖP 418.12 SEK
Butik:”=+0777
Ref: 200244238433 Term: 20024423
TVR: 0900000000 AID: A0000000031010
2025-02-22 13:30:50 TSI: 0000
Kontaktlös KA1 7 001 SWE 532942
Moms5s Moms Netto Brutto
12,00 44,81 373,31 418,12
SPARA KVITTOT
Öppettider
Alla dagar 07-22
välkommen åter!
Du betjänades av
Självcheckout Kassör
Kassa: 28/64 2025-02-22 13:30`
	]

	for (const [i, text] of texts.entries()) {
		const result = parseOCR(text)
		expect('error' in result).toBe(false)
	}


})

test('parseWillysOcrResult2', () => {
	const text = `Fridhemsplan
Tfn: 08-420 03 380
Org: 556163-2232
Öppet köp i 8 dagar med kvitto
Gäller inte kyl- och frysvaror
KNÄCKEBRÖD 550G 22,50
LAMMFRAMDEL MB
willys Plus:
2,360kg+129,00kr/kg 304,44
Rabatt:79,90 KR/KG MAX 3 -115,88
LAMMFRAMDEL MB
willys Plus:
2,318kg+129,00kr/kg 299,02
Rabatt:79,90 KR/KG MAX 3 -113,81
KYCKLINGKÖTTBULLAR 49,90
Rabatt :KÖTTBULLAR -15,00
ÄGG 15P INNE MEDIUM 39,90
Rabatt: ÄGG 15P -7,00
LIBANESISKT BRÖD 11,90
SMÖR NORMSALTAT 500G 65,90
Rabatt:SMÖR -13,00
SCHWEIZERNÖT 150G 3st19,90 59,70
TOMATER BABYPLOMMON 17,90
MANDELSEMLA 2-P 29,90
Totalt 12 varor
Totalt — 636,37 SEK
Låga priser på allt. Alltid.
willys Plus registrerat
willys Plus-nummer: 9752299071199367
Mottaget Kontokort 636,37
Ref:200244297191
Visa KRRARARRARARTESG
KÖP 636.37 SEK
Butik:”=+0777
Ref: 200244297191 Term: 20024429
TVR: 0900000000 AID: A0000000031010
2025-02-09 13:33:44 TSI: 0000
Kontaktlös KAL 7 001 SWE 393797
Moms5s Moms Netto Brutto
12,00 68,19 568,18 636,37
SPARA KVITTOT
Öppettider
Alla dagar 07-22
välkommen åter!
Du betjänades av
Självcheckout Kassör
Kassa: 26/81 2025-02-09 13:33`

	console.log(
		parseWillysOcrResult(text)
	)

	expect(parseWillysOcrResult(text)).toStrictEqual(
		{
			transaction_date: '2025-02-09',
			items: [
				{name: 'KNÄCKEBRÖD 550G', price: '22.50'},
				{
					name: 'LAMMFRAMDEL MB willys Plus: 2,360kg+129,00kr/kg',
					price: '304.44'
				},
				{
					name: 'LAMMFRAMDEL MB willys Plus: 2,360kg+129,00kr/kg (discount)',
					price: '-115.88'
				},
				{
					name: 'LAMMFRAMDEL MB willys Plus: 2,318kg+129,00kr/kg',
					price: '299.02'
				},
				{
					name: 'LAMMFRAMDEL MB willys Plus: 2,318kg+129,00kr/kg (discount)',
					price: '-113.81'
				},
				{name: 'KYCKLINGKÖTTBULLAR', price: '49.90'},
				{name: 'KYCKLINGKÖTTBULLAR (discount)', price: '-15.00'},
				{name: 'ÄGG 15P INNE MEDIUM', price: '39.90'},
				{name: 'ÄGG 15P INNE MEDIUM (discount)', price: '-7.00'},
				{name: 'LIBANESISKT BRÖD', price: '11.90'},
				{name: 'SMÖR NORMSALTAT 500G', price: '65.90'},
				{name: 'SMÖR NORMSALTAT 500G (discount)', price: '-13.00'},
				{name: 'SCHWEIZERNÖT 150G 3st19,90', price: '59.70'},
				{name: 'TOMATER BABYPLOMMON', price: '17.90'},
				{name: 'MANDELSEMLA 2-P', price: '29.90'}
			]
		}
	)
})