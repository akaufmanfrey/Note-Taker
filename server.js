const express = require('express');
const fs = require('fs');
const PORT = 3001;
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            res.json(JSON.parse(data))
        }
    })
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        const notesArray = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        const newNote = {
            title,
            text,
            id: crypto.randomUUID(),
        }
        notesArray.push(newNote);
        console.log(notesArray);
        res.status(201).json(notesArray);
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => err? console.log(err) : console.log('Note has been saved'))
    } else {
        res.status(500).json('Error in posting note')
    }

})
app.delete('/api/notes/:id', (req, res) => {
    const notesArray = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const noteId = req.params.id;
    console.log(noteId);
    const newNotesArray = notesArray.filter((note) => note.id !== noteId);
    console.log(newNotesArray);
    fs.writeFile('./db/db.json', JSON.stringify(newNotesArray), (err, data) => err? console.log(err) : console.log('Note has been deleted'))
    res.status(201).json(newNotesArray);
})

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
