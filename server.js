const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
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

let db;
const run = async() => {
    try{
        await client.connect();
    console.log('connected successfully to db')

     db = client.db("precapstone");
    }catch(err){
        console.log("failed to connect to db", err)
    }
}

run();

//register user
app.post('/api/users', async(req, res) => {
    try{
        const users = db.collection("users")
        const {name, email, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            role
        }
        const results = await users.insertOne(newUser);

        res.status(201).json({
            message: "inserted successfully!",
            id: results.insertedId
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

//login 
app.post('/api/login', async(req, res) => {
    try{
        const users = db.collection("users")
        const { email, password} = req.body;
        const results = await users.findOne({ email });

        if(!results){
            return res.status(401).json({ message: "user not found!"})
        }

        const isMatch = await bcrypt.compare(password, results.password);

        if(!isMatch){
            return res.status(401).json({ message: "Invalid credentials!"});
        }

        const token = jwt.sign(
            {id: results.id, role: results.role}, 
            process.env.JWT_SECRET, 
            {expiresIn: "1h"}
        );
        res.json({ token });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

//fetch user
app.get('/api/getUsers', async(req, res) => {
    try{
        const users = db.collection("users")
         const getUsers = await users.find().toArray();

         res.json(getUsers);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

app.put('/api/updateUser/:id', async(req, res) => {
    try{
        const users = db.collection("users");
        const updateUser = await users.updateOne({_id: new ObjectId(req.params.id)}, { $set: req.body});

        if(updateUser.matchedCount === 0) {
            return res.status(404).json({ message: 'user not found'});
        }

        res.status(201).json({message: "user updated"});
}catch(err){
    res.status(500).json({ error: err.message});
}
})

app.delete('/api/deleteUser/:id', async(req, res) => {
    try{
        const users = db.collection("users");
        const deleteUser = await users.deleteOne({_id: new ObjectId(req.params.id)}, { $set: req.body});

        if(deleteUser.deletedCount === 0) {
            return res.status(404).json({ message: 'user not found'});
        }

        res.json({message: "user deleted"});
}catch(err){
    res.status(500).json({ error: err.message});
}
})

app.listen(PORT, () => {
    console.log(` the server is running on port http://localhost:${PORT}`);
})