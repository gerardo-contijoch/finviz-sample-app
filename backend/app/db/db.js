import { MongoClient, ServerApiVersion } from 'mongodb';

const cnn_string = process.env.MONGO_DB_CNN_STRING;

const mongoOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

const client = new MongoClient(cnn_string, mongoOptions);

export async function testConnection() {
    await client.connect();
    try {
        await client.db('stockData').command({ ping: 1 });
    } finally {
        await client.close();
    }
}

export async function addStocksFundamentals(stocksFundamentals) {
    await client.connect();

    try {
        const database = client.db('stockData');
        const fundamentals = database.collection('fundamentals');

        const result = await fundamentals.insertMany(stocksFundamentals);
        console.log(`Se guardaron ${result.insertedCount} fundamentals`);
        return result.insertedCount;
    } catch (e) {
        console.error('No se pudieron guardar los fundamentals:', e);
        return false;
    } finally {
        await client.close();
    }
}

export async function addStockFundamentals(stockFundamentals) {
    await client.connect();

    try {
        const database = client.db('stockData');
        const fundamentals = database.collection('fundamentals');

        const result = await fundamentals.insertOne(stockFundamentals);
        console.log(`Inserted fundamental with id ${result.insertedId}`);
        return true;
    } catch (e) {
        console.error(`Could not insert document: `, e);
        return false;
    } finally {
        await client.close();
    }
}

export async function getAllStocksFundamentals() {
    await client.connect();

    try {
        const database = client.db('stockData');
        const fundamentals = database.collection('fundamentals');

        const cursor = fundamentals.find();

        let data = [];
        for await (const doc of cursor) {
            data.push(doc);
        }
        return data;
    } finally {
        await client.close();
    }
}

export async function clearStocksFundamentals() {
    await client.connect();

    try {
        const database = client.db('stockData');
        const fundamentals = database.collection('fundamentals');

        await fundamentals.deleteMany();
    } finally {
        await client.close();
    }
}
