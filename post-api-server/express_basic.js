const express = require('express');
const app = express();
const fs = require('fs')
//default is json file
const posts = JSON.parse(fs.readFileSync('./posts.json', 'utf8'));
//option for simple array
// const placeHolderData = require('./placeHolderdata')
// const posts = placeHolderData.placeHolderData;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected to DB")
});
mongoose.set('useFindAndModify', false);
app.use(express.json());

const postSchema = new mongoose.Schema({
    userId: Number,
    id:Number,
    title:String,
    body:String
});

const Post = mongoose.model('post', postSchema);

app.get('/posts', (req, res) => {
    Post.find((err,post)=>{
        if(err) {
            console.log(err)
        }
        res.send(post)
    })
})

app.get('/posts/:id', function (req, res) {
    Post.find({id:parseInt(req.params.id)},(err,post) => {
        if(err) {
            console.log(err)
        }
        res.send(post);
        console.log(post)
    })});

app.get('/', function (req, res) {
    res.redirect('/posts')
});

app.put('/posts/:id', function (req, res) {
    //filter by id params in url
    const id = {id:parseInt(req.params.id)};
    Post.findOneAndUpdate(id, req.body, function (err, post) {
        if(err) {
            console.log(err)
        }
       res.redirect('/posts')
    });
});

app.post('/posts', function (req, res) {
    const data = {
        userId:req.body.userId,
        id:req.body.id,
        title:req.body.title,
        body:req.body.body
    };
    const post = new Post(data)
    post.save()
    res.send(post)
});

app.delete('/posts/:id', (req, res) => {
    const id = {id:parseInt(req.params.id)};
    Post.deleteOne(id, (err)=>{
        if (err){
            console.log('error with provided id')
        }
        res.redirect('/posts')
    })
});

app.get('*', (req, res) => {
    res.redirect('/posts')
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));


