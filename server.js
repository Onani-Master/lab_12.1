// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const connectionString = 'mongodb+srv://onani_master:2003@cluster0.7sjmpmz.mongodb.net/';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        
        app.set('view engine', 'ejs') 
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        // Edit route
        app.get('/quotes/:id/edit', (req, res) => {
            const quoteId = req.params.id;
            quotesCollection.findOne({ _id: new ObjectID(quoteId) })
                .then(result => {
                    res.render('edit.ejs', { quote: result })
                })
                .catch(error => console.error(error))
        })

        // Update route
        app.post('/quotes/:id/update', (req, res) => {
            const quoteId = req.params.id;
            quotesCollection.updateOne(
                { _id: new ObjectID(quoteId) },
                { $set: { name: req.body.name, quote: req.body.quote } }
            )
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        // Delete route
        app.post('/quotes/:id/delete', (req, res) => {
            const quoteId = req.params.id;
            quotesCollection.deleteOne({ _id: new ObjectID(quoteId) })
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })