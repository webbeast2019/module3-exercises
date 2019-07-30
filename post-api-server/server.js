'use strict';
const express = require('express');
const postsRouter = express.Router();
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const ENCODING = 'utf-8';
const DB_PATH = './post-api-server/posts.json';
let maxId = 0;
fs.readFile(DB_PATH, 'utf-8', (err, data) => {
    maxId = Math.max(...JSON.parse(data).map(post => post.id));
});
const errFunc = (err) => {
    if (err) {
        throw err;
    }
};

postsRouter.use(bodyParser.json());
postsRouter.get('/', (req, res) => {
    const data = fs.readFileSync(DB_PATH, ENCODING);
    res.send(data);
});


postsRouter.post('/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, ENCODING));
    const newPost = req.body;
    maxId += 1;
    newPost.id = maxId + 1;
    data.push(newPost);
    fs.writeFile(DB_PATH, JSON.stringify(data, null, '\t'), errFunc);
    res.send(newPost);
});


postsRouter.delete('/', function (req, res) {
    const id = parseInt(req.query.id);
    const data = JSON.parse(fs.readFileSync(DB_PATH, ENCODING));
    const postToReturn = data.find(post => post.id === id);
    fs.truncate(DB_PATH, errFunc);
    fs.writeFile(DB_PATH, JSON.stringify(data.filter(posts => parseInt(posts.id) !== id), null, '\t'), errFunc);
    console.log(postToReturn);
    res.send(postToReturn);

});

postsRouter.get('/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync(DB_PATH, ENCODING));
    const postToSend = data.find(post => id === parseInt(post.id));
    res.send(postToSend);
});

postsRouter.put('/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync(DB_PATH, ENCODING));
    const postToUpdate = data.find(post => post.id === id);
    Object.getOwnPropertyNames(req.query).forEach(key => postToUpdate[key] = req.query[key]);
    const updatedData = data.filter(post => post.id !== id);
    updatedData.push(postToUpdate);
    fs.truncate(DB_PATH, errFunc);
    fs.writeFile(DB_PATH, JSON.stringify(updatedData, null, '\t'), errFunc);
    res.send(postToUpdate);


});

app.use('/posts', postsRouter);
app.get('/',(req,res)=>{
 res.redirect('/posts');
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));



