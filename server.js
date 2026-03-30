const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());


app.listen(PORT, () => {
    console.log(` the server is running on port ${PORT}`);
})