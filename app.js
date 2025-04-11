const dotenv = require('dotenv');
dotenv.config(); // ✅ Load env variables FIRST

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("The shop4donate project!");
});

app.listen(PORT, () => {
    console.log(`✅ The server is running on port ${PORT}`);
    console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL);
});
