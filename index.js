const express = require('express');
const { Client } = require('pg');
require('dotenv').config()

const app = express();
const port = 8000;
const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

client.connect();

app.use(express.json());

app.get('/tickets', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM tickets');

        res.status(200).json({
            status: "succes",
            data: data.rows
        })
    }

    catch (err) {
        res.status(404).json({
            status: "not found",
            data: null
        })
    }
});

app.get('/tickets/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const data = await client.query('SELECT * FROM tickets where id = $1', [id]);

        res.json(data.rows);
    }
    catch (err) {
        console.log(err.stack)
    }
});

app.post('/tickets', async (req, res) => {
    console.log(req.body);

    try {
        const message = req.body.message;

        console.log(message);
        const data = await client.query('INSERT INTO tickets (message) VALUES ($1)', [message]);

        res.status(200).json({
            status: "succes",
            data: data.rows
        })
    }

    catch (err) {
        res.status(404).json({
            status: "not found",
            data: null
        })
    }
});

app.delete('/tickets/:id', async (req, res) => {
    console.log(req.params)

    const id = req.params.id;

    try {
        const data = await client.query('SELECT * FROM tickets where id = $1', [id]);

        res.status(200).json({
            status: "succes",
            data: data.rows
        })
    }

    catch (err) {
        res.status(404).json({
            status: "not found",
            data: null
        })
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port:${port}`)
})
