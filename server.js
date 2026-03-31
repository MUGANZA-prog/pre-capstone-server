const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = 8000;
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const URL = process.env.DATABASE_URL

const client = new MongoClient(URL);
const run = async() => {
    try{
        await client.connect();
    console.log('connected successfully to db')
    }catch(err){
        console.log("failed to connect to db", err)
    }
}

run();

app.listen(PORT, () => {
    console.log(` the server is running on port ${PORT}`);
})