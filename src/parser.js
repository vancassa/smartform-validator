const csv = require('csv');

const columnSchema = {
    results   : [
    'id',
    'content',
    ],
    questions : [
    'id',
    'text',
    'inputType',
    'answers',
    'responses',
    'defaultAnswer',
    ],
}

/**
 * CSV parser
 * @module parser
 */

/**
 * Parse CSV to JSON
 */

module.exports = (schemaType, inputData) => {
    return new Promise ((resolve, reject) => {
        csv.parse(
            inputData,
            {
                from: 2,
                columns: columnSchema[schemaType]
            },
            (err, data) => {
                if (err) reject(err);
                resolve(data);
            }
        )
    })
}
