import {expect, test} from 'vitest'
import {merge} from './dictionary.js'


test('merge', () => {
    const arr = [
        {
            "category": "Pantry Staples",
            "sub_category": "Grains & Pasta",
            "items": [
                "ris", "risset"
            ]
        },
        {
            "category": "Pantry Staples",
            "sub_category": "Canned & Jarred Goods",
            "items": [
                "soppor", "sopporna"
            ]
        }]

    expect(
        merge(arr)).toStrictEqual(
        ["ris", "risset", "soppor", "sopporna"]
    )
})

