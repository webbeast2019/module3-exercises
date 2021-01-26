'use strict';

const express = require('express');
const app = express();
const PORT = 4000;
const fs = require('fs');

app.use(express.json());

let postsData = [];

fs.readFile('./posts.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err.message);
  } else {
    postsData = JSON.parse(data);
  }
});

const writeToFile = (file, data) => {
  fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('The file is done!');
    }
  });
};

const newId = (index = 1) => {
  const id = postsData.length + index;
  const post = postsData.find(post => post.id === id);
  if (post) {
    return newId(index + 1);
  }
  return id;
};

//POST
app.post('/posts', (req, res) => {
  const id = newId();
  const { userId, title, body } = req.body;
  const post = { userId, id, title, body };
  postsData.push(post);
  writeToFile('posts.json', postsData);
  res.status(200).send('Accepted');
});

//GET
app.get('/posts', (req, res) => {
  res.send(postsData);
});

app.get('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = postsData.find(post => post.id === id);
  if (post) {
    res.send(post);
  } else {
    res.send(`There is no post with id = ${id}`);
  }
});

app.get('/', (req, res) => {
  res.redirect('/posts');
});

//PUT
app.put('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { userId, title, body } = req.body;
  const post = postsData.find(post => post.id === id);
  if (post) {
    post.userId = userId || post.userId;
    post.title = title || post.title;
    post.body = body || post.body;
    writeToFile('posts.json', postsData);
    res.status(200).send('Accepted');
  } else {
    res.send(`There is no post with id = ${id}`);
  }
});

//DELETE
app.delete('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = postsData.find(post => post.id === id);
  if (post) {
    postsData = postsData.filter(post => post.id !== id);
    writeToFile('posts.json', postsData);
    res.status(200).send('Accepted');
  } else {
    res.send(`There is no post with id = ${id}`);
  }
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
