const { MongoClient } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const loadData = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db('zomato');

        // List of your 5 JSON files
        const filePaths = [
            './archive/file1.json',
            './archive/file2.json',
            './archive/file3.json',
            './archive/file4.json',
            './archive/file5.json'
        ];

        // Loop through all JSON files and load the data
        for (const filePath of filePaths) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')); // Read and parse each JSON file
            await db.collection('restaurants').insertMany(data); // Insert into MongoDB
            console.log(`Data from ${filePath} loaded successfully.`);
        }

        console.log('All data loaded');
        client.close();
    } catch (error) {
        console.error('Error loading data', error);
    }
};

loadData();
