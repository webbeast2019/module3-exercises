'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 4000;

const posts = new Map();
let nextId = 0;

// Load and cache data and set nextId
JSON.parse(fs.readFileSync(path.join(__dirname, './posts.json'))).forEach(post => {
  if (post.id && Number.isInteger(post.id)) {
    posts.set(post.id, post);
    if (post.id > nextId) {
      nextId = post.id;
    }
  }
});
nextId++;

const app = configureServer();

// Start server
app.listen(PORT, () => console.log(`Client is available at http://localhost:${PORT}`));

function configureServer() {
  const app = express();
  app.use(express.json());                          // to support JSON-encoded bodies
  app.use(express.urlencoded({ extended: true }));  // to support URL-encoded bodies

  // GET /posts/:id
  app.get('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const post = posts.get(id);
    if (post) {
      res.json(post);
    } else {
      res.send(`Cannot find post with id=${req.params.id}`);
    }
  });

  // GET /posts
  app.get('/posts', function (req, res) {
    res.json([...posts.values()]);
  });

  // GET /
  app.get('/', (req, res) => {
    res.redirect('/posts');
  });

  // POST
  app.post('/posts', function (req, res) {
    const { userId, title, body } = req.body;
    const id = nextId++;
    const post = { userId, id, title, body };
    posts.set(id, post);
    res.send(`Post with id=${id} has been added`);
  });

  // PUT
  app.put('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (posts.has(id)) {
      const { userId, title, body } = req.body;
      const post = { userId, id, title, body };
      posts.set(id, post);
      res.send(`Post with id=${id} has been updated`);
    } else {
      res.send(`Cannot find post with id=${req.params.id}`);
    }
  });

  // DELETE /posts/:id
  app.delete('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    if (posts.delete(id)) {
      res.send(`Post with id=${id} has been deleted`);
    } else {
      res.send(`Cannot find post with id=${req.params.id}`);
    }
  });

  return app;
}
