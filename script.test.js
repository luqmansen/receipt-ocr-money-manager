import {expect, test} from 'vitest'
import {addSubCategory, enrichItems, outputMoneyManagerFormat, parseWillysOcrResult} from "./script";

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
        [{
            "transaction_date": new Date("2025-02-22T12:30:00.000Z"),
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
                },
                {
                    "name": "STANDMJÖLK ESL 1,5L",
                    "price": "19.50",
                    "subCategory": "Food Supplies",
                    "bestMatch": {
                        "category": "Food Supplies",
                        "match": "mandelmjolk",
                        "score": 53
                    },
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
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
                    "category": "food"
                }
            ]
        }]
    )

})

test('outputMoneyManagerFormat', async () => {
    const items = [
        {
            "transaction_date": new Date("2025-02-14T14:11:00.000Z"),
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
