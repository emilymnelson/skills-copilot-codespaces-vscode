// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
// Create connection to database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/Chinook_Sqlite_AutoIncrementPKs.sqlite');
// Use body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// GET /api/artists
app.get('/api/artists', (req, res) => {
    db.all('SELECT * FROM artists;', (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(rows);
        }
    });
});
// GET /api/artists/:id
app.get('/api/artists/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM artists WHERE ArtistId = ${id};`, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(row);
        }
    });
});
// POST /api/artists
app.post('/api/artists', (req, res) => {
    const name = req.body.name;
    db.run(`INSERT INTO artists (Name) VALUES ("${name}");`, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            db.get(`SELECT * FROM artists WHERE ArtistId = ${this.lastID};`, (err, row) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).send(row);
                }
            });
        }
    });
});
// PUT /api/artists/:id
app.put('/api/artists/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    db.run(`UPDATE artists SET Name = "${name}" WHERE ArtistId = ${id};`, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            db.get(`SELECT * FROM artists WHERE ArtistId =