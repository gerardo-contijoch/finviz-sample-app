import express from 'express';
import cors from 'cors';
import { mapEndpointHandlers as mapTestEndpoints } from './handlers/test.js';
import { mapEndpointHandlers as mapDataEndpoints } from './handlers/stockdata.js';

var host = process.env.API_HOST || 'localhost';
var port = parseInt(process.env.API_PORT) || 9090;

var app = express();
app.use(cors());

mapTestEndpoints(app);

mapDataEndpoints(app);

app.listen(port, host, () => {
    console.log('Listening on http://%s:%d', host, port);
});
