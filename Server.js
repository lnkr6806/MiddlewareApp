const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3001;
const cors = require("cors");
const { v4: uuidv4 } = require('uuid'); // Import UUID library

app.use(express.json());
app.use(cors());
let db = require('./db.json');

app.get('/fetchnews', (req, res) => {
  res.json(db.news);
});

app.post('/addnews', (req, res) => {
    const newNewsItem = req.body;
    const newsId = uuidv4(); 
    newNewsItem.newsId = newsId; 
    
    const updatedNewsItem = {
      newsId: newNewsItem.newsId,
      title: newNewsItem.title,
      content: newNewsItem.content,
      image: newNewsItem.image
    };
    db.news.push(updatedNewsItem);
    fs.writeFileSync('./db.json', JSON.stringify(db));
    res.status(201).json(updatedNewsItem);
  });


app.delete('/deletenews/:newsId', (req, res) => {
  const index = req.params.newsId;
  db.news.splice(index, 1);
  fs.writeFileSync('./db.json', JSON.stringify(db));
  res.status(200).send('News item deleted successfully.');
});



app.put('/updatenews/:newsId', (req, res) => {
    const { newsId } = req.params;
    const updatedNewsItem = req.body;
  
    const index = db.news.findIndex(item => item.newsId === newsId);
    if (index !== -1) {
      
      db.news[index] = { ...db.news[index], ...updatedNewsItem };
      fs.writeFileSync('./db.json', JSON.stringify(db));
      res.status(200).json(db.news[index]);
    } else {
      res.status(404).send('News item not found.');
    }
  });
  
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
      const rawData = fs.readFileSync('./db.json');
    const db = JSON.parse(rawData);
    const admin = db.admin;
  
    if (admin && username === admin.username && password === admin.password) {
        console.log("username",admin.username);
      res.status(200).send({ username: admin.username, message: 'Login successful' });
    } else {
     res.status(401).send({ error: 'Invalid username or password' });
    }
  });
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
