const express = require('express')
const {connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

// init app & middleware

const app = express()
app.use(express.json())

// connect db
let db
connectToDb((err) => {
    if(!err) {
    app.listen(3000, () => {
    console.log("app listening on port 3000")
})
db = getDb()
    }
})

// routes 
app.get('/books', (req, res) => {
    const page = req.query.p == 0
    const booksPerPage = 2
    let books = []

    // to reach into collection in a db, you use .collection('dbname')
    //.find() returns cursor, object that points set of documents outlined by query. toArray makes it an array and forEach used to process them indiviaully.
    db.collection('books').find() 
    .sort({ author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => {
        books.push(book)
    }).then(() => {
    res.status(200).json(books)}).catch(() => {
    res.status(500).json({error: "couldn't fetch documents"})});
})

app.get('/books/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id)) {
db.collection('books').findOne({_id: new ObjectId(req.params.id)}).then(
        doc => {
            if (doc != null) {
              res.status(200).json(doc)
            } else {
                res.status(500).json({mssg: "no objects found"})
            }
            
        }).catch(err => {
            res.status(500).json({err: "couldn't fetch objects"})
        });
    } else {
        res.status(500).json({err: "not vaild id"})
    }
})
app.post('/books', (req, res) => {
        const book = req.body
        db.collection('books').insertOne(book)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({err: "couldnt add the object"})
        })
    })
app.delete('/books/:id', (req, res) => {
 if(ObjectId.isValid(req.params.id)) {
db.collection('books').deleteOne({_id: new ObjectId(req.params.id)}).then(
        doc => {
            if (doc != null) {
              res.status(200).json(doc)
                } else {
                res.status(500).json({mssg: "no objects found"})
            }
        }).catch(err => {
            res.status(500).json({err: "couldn't delete object"})
        });
    } else {
        res.status(500).json({err: "not vaild id"})
    }
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body
     if(ObjectId.isValid(req.params.id)) {
      db.collection('books').updateOne({_id: new ObjectId(req.params.id)}, {$set: updates}).then(
        doc => {
            if (doc != null) {
              res.status(200).json(doc)
                } else {
                res.status(500).json({mssg: "no objects found"})
            }
            
        }).catch(err => {
            res.status(500).json({err: "couldn't update object"})
        });
    } else {
        res.status(500).json({err: "not vaild id"})
    }
})