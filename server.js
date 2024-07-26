const express = require('express');
const fs = require('fs');
const PORT = 3001;
const path = require('path');
const app = express();
const data = require('./db/db.json');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => res.json(data));

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const notesArray = data;
        const newNote = {
            title,
            text,
            review_id: crypto.randomUUID(),
        }
        notesArray.push(newNote);
        console.log(notesArray);
        res.status(201).json(notesArray);
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => err? console.log(err) : console.log('Note has been saved'))
    } else {
        res.status(500).json('Error in posting review')
    }

})
console.log(data);
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
