import {expect, test} from 'vitest'
import {addSubCategory, outputMoneyManagerFormat, parseWillysOcrResult} from "./script";

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
Kassa: 31/70 2025-02-14 15:11
    `

    expect(parseWillysOcrResult(text)).toStrictEqual(
        {
            "transaction_date": new Date("2025-02-14T14:11:00.000Z"),
            "items": [
                {
                    "name": "SHOT INGEF/GURKM",
                    "price": "43.90"
                },
                {
                    "name": "ÖVERLÅR KYCKLING 2st49,90",
                    "price": "99.80"
                },
                {
                    "name": "GORGONZOLA",
                    "price": "29.90"
                },
                {
                    "name": "BONDBÖNOR 450G",
                    "price": "24.90"
                },
                {
                    "name": "BROCCOLI",
                    "price": "9.90"
                },
                {
                    "name": "JORDGUBBAR 250G 3st+44,90",
                    "price": "59.70"
                }
            ]
        }
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