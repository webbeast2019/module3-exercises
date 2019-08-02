const express = require('express');
const app = express();
const fs = require('fs')
//default is json file
const posts = JSON.parse(fs.readFileSync('./posts.json', 'utf8'));
//option for simple array
// const placeHolderData = require('./placeHolderdata')
// const posts = placeHolderData.placeHolderData;

app.use(express.json());

app.get('/posts', (req, res) =>
    res.send(posts));

app.get('/posts/:id', function (req, res) {
    const post = posts.filter(data => parseInt(req.params.id) === data.id);
    if (!post) {
        res.status(404).send('The post with the given id not found')
    }
    res.send(post)
});

app.get('/', function (req, res) {
    res.redirect('/posts')
});

app.put('/posts/:id', function (req, res) {
    //filter by id params in url
    let post = posts.find(post => post.id === parseInt(req.params.id));
    if (!post) {
        res.status(404).send('The post with the given id not found')
    }
    post.title = req.body.title
    post.body = req.body.body
    fs.writeFileSync('./posts.json', JSON.stringify(posts))
    res.send(post)
});

app.post('/posts', function (req, res) {
    const post = {
        userId: req.body.userId,
        id: req.body.id,
        title: req.body.title,
        body: req.body.body
    }
    if (!post.userId || !post.id || !post.title || !post.body) {
        res.sendStatus(404).send('Please Provide A Full Post details')
    }
    posts.push(post)
    fs.writeFileSync('./posts.json', JSON.stringify(posts))
    res.send(post);
});

app.delete('/posts/:id', (req, res) => {
    const post = posts.find(post => post.id === parseInt(req.params.id));
    if (!post) {
        res.sendStatus(404).send('The post with the given id not found')
    }
    const index = posts.indexOf(post);
    posts.splice(index, 1);
    fs.writeFileSync('./posts.json', JSON.stringify(posts));
    res.send(posts)
});

app.get('*', (req, res) => {
    res.redirect('/posts')
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));


