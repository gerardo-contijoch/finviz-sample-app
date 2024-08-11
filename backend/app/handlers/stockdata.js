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
    app.post('/api/data/new', addStockDataHandler);
    app.post('/api/data/initialize', initializeDBHandler);
    app.post('/api/data/clear', clearDBHandler);
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns
 */
async function getStocksDataHandler(req, res) {
    var symbolFilter = req.query.symbol ? req.query.symbol.toLocaleString() : undefined;
    var nameFilter = req.query.name ? req.query.name.toLocaleString() : undefined;

    if (symbolFilter) symbolFilter = sanitizeSymbol(symbolFilter);
    // TODO: habria que sanitizar el nombre, pero practicamente cualquier string es valido

    var data = await getStocksFundamentals(symbolFilter, nameFilter);

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

    if (validateFinVizKey(API_KEY)) {
        // Usar esta url para testing
        //`${FINVIZ_URL}?v=152&c=0,1,6,7,24,32,33,34,65,2&f=sh_avgvol_o2000&auth=${API_KEY}`

        console.log('Inicializando db desde finviz...');

        await fetch(`${FINVIZ_URL}?v=152&c=0,1,6,7,24,32,33,34,65,2&auth=${API_KEY}`).then(async (r) => {
            const lines = (await r.text()).split('\n');

            // La primer linea es el header
            fundamentals = await parseLines(lines.slice(1));
        });
    } else {
        console.log('Inicializando db con fake data...');
        let data;
        try {
            data = fs.readFileSync('fake-data.json');
        } catch (err) {
            console.error('Error al leer el archivo fake-data.json:', err);
        }

        if (data) fundamentals = JSON.parse(data.toString());
    }

    let count = 0;
    // Si tenemos datos parseados, borramos todo lo que hay en la tabla de fundamentals
    if (fundamentals && fundamentals.length > 0) {
        await clearStocksFundamentals();

        var inserted = await addStocksFundamentals(fundamentals);
        if (!inserted) {
            console.error(`No fue posible inicializar la DB con ${fundamentals.length} simbolos.`);
            count = 0;
        } else count = inserted;
    }

    if (count > 0) return res.status(200).json({ message: `Se inicializó la DB con ${count} registros` });
    else return res.status(500).json({ message: 'No fue posible inicializar la DB.' });
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns
 */
async function clearDBHandler(req, res) {
    await clearStocksFundamentals();
    return res.status(200).json({ message: `Se limpió la DB correctamente.` });
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

/**
 * Validacion pedorra del key de fin viz.
 * @param {*} key
 * @returns
 */
function validateFinVizKey(key) {
    return key && key.length == 36 && key == key.replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * Poor man sanitize
 * @param {string} symbol
 * @returns
 */
function sanitizeSymbol(symbol) {
    return symbol.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}
