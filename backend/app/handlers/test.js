import e from 'express';

/**
 * Mapea los endpoints de testing.
 * @param {e.Express} app
 */
export function mapEndpointHandlers(app) {
    app.get('/', testHandler);
    app.get('/api/test', testHandler);
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns
 */
async function testHandler(req, res) {
    console.log("'/api/test' reached!");
    return res.status(200).json({ message: 'OK!' });
}
