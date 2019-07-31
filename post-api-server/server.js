'use strict';
const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 4000;

const data = fs.readFileSync('./posts.json','utf8');
const posts = [...JSON.parse(data)];

app.get('/', function (req,res) {
    res.redirect('/posts');
});

app.get('/posts', (req, res) => res.send(posts));

app.get('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);
    if(!post) {
        res.status(404).send('The post with the given ID was not found.');
    }
    res.send(post);
});

app.delete('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const newPosts = posts.filter((post) => post.id !== id);
    if(newPosts.length === posts.length) {
        res.status(404).send('The post with the given ID was not found.');
    } else{
        fs.writeFileSync('./posts.json', JSON.stringify(newPosts));
        res.send(newPosts);
    }
});

app.all('*', function (req,res) {
    res.redirect('/posts');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

