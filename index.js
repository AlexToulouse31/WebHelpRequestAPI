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

app.get('/api/tickets', async (req, res) => {
    try {
        const data = await client.query('SELECT * FROM tickets');

        res.status(200).json({
            status: "success",
            data: { post: data.rows }
        })
    }

    catch (err) {
        res.status(404).json({
            status: "not found",
            data: null
        })
    }
});

app.get('/api/tickets/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const data = await client.query('SELECT * FROM tickets where id = $1', [id]);

        res.status(200).json({
            status: "success",
            data: { post: data.rows }
        })
    }

    catch (err) {
        res.status(404).json({
            status: "not found",
            data: null
        })
    }
});

app.post('/api/tickets', async (req, res) => {

    try {
        const message = req.body.message;

        const data = await client.query('INSERT INTO tickets (message) VALUES ($1) returning *', [message]);

        res.status(201).json({
            status: "created",
            data: { post: data.rows }
        })
    }

    catch (err) {
        res.status(404).json({
            status: "not found",
            data: null
        })
    }
});

app.put('/api/tickets/:id', async (req, res) => {
    const id = req.params.id;
    const message = req.body.message;

    try {
        const data = await client.query('UPDATE tickets SET (message, done) = ($2, true) WHERE id = $1 returning *', [id, message]);
        
        res.status(200).json({
            status: "success",
            data: { post: data.rows }

        })
    }

    catch (err) {
        res.status(404).json({
            status: "not found",
            data: null
        })
    }
});


app.delete('/api/tickets/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const data = await client.query('DELETE FROM tickets where id = $1', [id]);

        res.status(200).json({
            status: "deleted",
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

app.listen(port, () => {
    console.log(`Example app listening on port:${port}`)
});
