// import express
const express = require("express");
const cors = require("cors");

// create the app
const app = express();

// define port number
const port = process.env.PORT || 5000;

// add middleware
app.use(cors({
    origin: ["http://localhost:3000", "https://restny.vercel.app"]
}))

// create a get request
app.get('/', (request, response) => {
    const message = {message: "Hello from server"};
    response.json(message);
});

// server listening
app.listen(port, () => {
    console.log(`listening at port ${port}`);
});