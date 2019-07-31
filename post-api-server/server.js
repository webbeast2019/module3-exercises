'use strict';
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

const data = fs.readFileSync('./posts.json', 'utf8');
const posts = [...JSON.parse(data)];

app.use(express.json());

app.get('/', function (req, res) {
    res.redirect('/posts');
});

app.get('/posts', (req, res) => res.send(posts));

app.get('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);
    if (!post) {
        res.status(404).send('The post with the given ID was not found.');
    }
    res.send(post);
});

app.delete('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const deletedPost = posts.find((post) => post.id === id);
    const newPosts = posts.filter((post) => post.id !== id);
    if (newPosts.length === posts.length) {
        res.status(404).send('The post with the given ID was not found.');
    } else {
        fs.writeFileSync('./posts.json', JSON.stringify(newPosts));
        res.send(deletedPost);
    }
});

app.post('/posts', function (req, res) {
    if (!req.body.userId || !req.body.title || !req.body.body || isNaN(parseInt(req.body.userId))) {
        res.status(400).send('Something wrong with one or more of the post properties');
        return;
    }
    const newPostId = posts[posts.length - 1].id + 1;
    const newPost = {
        userId: req.body.userId,
        id: newPostId,
        title: req.body.title,
        body: req.body.body
    };
    posts.push(newPost);
    fs.writeFileSync('./posts.json', JSON.stringify(posts));
    res.send(newPost);
});

app.put('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);
    if (!post) {
        res.status(404).send('The post with the given ID was not found.');
    }

    if (!req.body.title || !req.body.body) {
        res.status(400).send('Something wrong with one or more of the post properties');
        return;
    }
    post.title = req.body.title;
    post.body = req.body.body;
    fs.writeFileSync('./posts.json', JSON.stringify(posts));
    res.send(post);
});

app.get('*', function (req, res) {
    res.redirect('/posts');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));