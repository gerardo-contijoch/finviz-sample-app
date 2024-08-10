import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { transform } from 'stream-transform';
import {
    addStockFundamentals,
    addStocksFundamentals,
    clearStocksFundamentals,
    getStocksFundamentals,
} from '../db/db.js';
import fs from 'fs';
import e from 'express';

/**
 * Mapea los endpoints para acceder a los datos.
 * @param {e.Express} app
 */
export function mapEndpointHandlers(app) {
    app.get('/api/data', getStocksDataHandler);
    app.get('/api/data/new', addStockDataHandler);
    app.get('/api/data/initialize', initializeDBHandler);
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns
 */
async function getStocksDataHandler(req, res) {
    var symbolFilter = req.query.symbol ?? '';
    var data = await getStocksFundamentals(symbolFilter.toString());

    return res.status(200).json(data);
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns
 */
async function addStockDataHandler(req, res) {
    const doc = {
        symbol: 'APPS',
        price: 2.88,
        marketCap: 295.46 * 1000000,
        priceEarnings: undefined,
        sharesOutsanding: 102.12 * 1000000,
        ROA: -0.4121,
        ROE: -1.1002,
        ROI: -0.734,
    };

    var inserted = await addStockFundamentals(doc);

    if (inserted) return res.status(200).json({ message: 'Stock successfully added' });
    else return res.status(500).json({ message: 'Error adding stock' });
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns
 */
async function initializeDBHandler(req, res) {
    const API_KEY = process.env.FINVIZ_API_KEY;
    const FINVIZ_URL = 'https://elite.finviz.com/export.ashx';

    let fundamentals = [];

    if (req.query.use_finviz) {
        // Usar esta url para testing
        //`${FINVIZ_URL}?v=152&c=0,1,6,7,24,32,33,34,65&f=ta_change_u20&auth=${API_KEY}`

        await fetch(`${FINVIZ_URL}?v=152&c=0,1,6,7,24,32,33,34,65,2&auth=${API_KEY}`).then(async (r) => {
            const lines = (await r.text()).split('\n');

            // La primer linea es el header
            fundamentals = await parseLines(lines.slice(1));
        });
    } else {
        fs.readFile('fake-data.json', (err, data) => {
            if (err) console.log('Error al leer el archivo:', err);
            fundamentals = JSON.parse(data.toString());
        });
    }

    let count = 0;
    // Si tenemos datos parseados, borramos todo lo que hay en la tabla de fundamentals
    if (fundamentals && fundamentals.length > 0) {
        await clearStocksFundamentals();

        var inserted = await addStocksFundamentals(fundamentals);
        if (!inserted) count = 0;
        else count = inserted;
    }

    if (count > 0) return res.status(200).json({ message: `Se inicializó la DB con ${count} registros` });
    else return res.status(500).json({ message: 'No fue posible inicializar la DB.' });
}

/**
 *
 * @param {string[]} lines
 * @returns
 */
async function parseLines(lines) {
    // Configuramos el parser de cvs
    const parser = parse({
        delimiter: ',',
    });

    const transformer = transform((record, callback) => {
        callback(null, {
            symbol: record[1],
            marketCap: parseFloat(record[2]) * 1000000,
            priceEarnings: parseFloat(record[3]),
            sharesOutsanding: parseFloat(record[4]) * 1000000,
            ROA: parseFloat(record[5]) * 100,
            ROE: parseFloat(record[6]) * 100,
            ROI: parseFloat(record[7]) * 100,
            price: parseFloat(record[8]),
            name: record[9],
        });
    });

    return await Readable.from(lines).pipe(parser).pipe(transformer).toArray();
}
