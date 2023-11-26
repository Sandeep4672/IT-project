const { MongoClient } = require('mongodb');

let database;

const mongodbURL = process.env.MONGODB_URL;  // Ensure this environment variable is correctly set


let client;

try {
    client = new MongoClient(mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
        }
    });
} catch (error) {
    console.error("MongoClient initialization failed:", error.message);
}

async function connectToDatabase() {
    if (!client) {
        console.error("MongoClient is not initialized.");
        return;
    }
    try {
        await client.connect();
        console.log(`Connected to the database successfully: ${mongodbURL}`);
        database = client.db('code2clear');
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
    }
}

function getDb() {
    if (!database) {
        const errMsg = 'You must connect first!';
        console.error(errMsg);
        throw new Error(errMsg);
    }
    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
};
