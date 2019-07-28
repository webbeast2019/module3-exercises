'use strict';
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const ENCODING = 'utf-8';

let  maxId=0 ;
fs.readFile('./posts.json','utf-8',(err,data)=> {
    maxId = Math.max(...JSON.parse(data).map(post => post.id));
});
const errFunc = (err) => {
    if(err){
        throw err;
    }
};

app.use(bodyParser.json());
app.get('/posts', (req, res) => {
    const data  = fs.readFileSync('./posts.json',ENCODING);
    res.send(data);
});

app.get('/posts/:id', function (req, res) {
    const id = parseInt(req.params.id);
    const data  = JSON.parse(fs.readFileSync('./posts.json',ENCODING));
    const postToSend = data.find(post=> id === parseInt(post.id));
    res.send(postToSend);
});

app.put('/posts/:id', function (req,res){
    const id = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync('./posts.json',ENCODING));
    const postToUpdate =data.find(post => post.id === id);
    Object.getOwnPropertyNames(req.query).forEach(key=>postToUpdate[key] = req.query[key]);
    const updatedData = data.filter(post => post.id !== id);
    updatedData.push(postToUpdate);
    fs.truncate('./posts.json',errFunc);
    fs.writeFile('./posts.json',JSON.stringify(updatedData,null,'\t'),errFunc);

    res.send(postToUpdate);


});

app.post('/posts/',(req,res)=>{
    const data = JSON.parse(fs.readFileSync('./posts.json',ENCODING));
    const newPost = req.body;
    maxId+=1;
    newPost.id= maxId+1;
    data.push(newPost);
    fs.writeFile('./posts.json',JSON.stringify(data,null,'\t'),errFunc);
    res.send(newPost);
});


app.delete('/posts/', function (req, res) {
    const id = parseInt(req.query.id);
    const data  = JSON.parse(fs.readFileSync('./posts.json',ENCODING));
    const postToReturn = data.find(post=>post.id===id);
    fs.truncate('./posts.json',errFunc);
    fs.writeFile('./posts.json',JSON.stringify(data.filter(posts=> parseInt(posts.id) !== id),null,'\t'),errFunc);
    console.log(postToReturn);
    res.send(postToReturn);

});

app.listen(3000, () => console.log('Example app listening on port 3000!'));



