const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');

class Post {
    constructor(title, text) {
        this.title = title;
        this.text = text;
        this.id = uuid();
    }

    toJSON() {
        return {
            title: this.title,
            text: this.text,
            id: this.id,
        };
    }

    static async update(post) {
        const posts = await Post.getAllPosts();
        const idx = posts.findIndex(item => post.id === item.id);
        posts[idx] = post;

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'posts.json'),
                JSON.stringify(posts),
                'utf-8',
                err => {
                    if (err) reject(err);
                    else {
                        resolve();
                    }
                }
            );
        });
    }

    async save() {
        const posts = await Post.getAllPosts();
        posts.push(this.toJSON());

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'posts.json'),
                JSON.stringify(posts),
                'utf-8',
                err => {
                    if (err) reject(err);
                    else {
                        resolve();
                    }
                }
            );
        });
    }    

    static async getPostById(id) {
        const posts = await this.getAllPosts();

        return posts.find(post => post.id === id);
    }

    static getAllPosts() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', 'posts.json'), 'utf-8', (err, content) => {
                if (err) reject(err);
                else {
                    resolve(JSON.parse(content));
                }
            });
        });
    }

    static async delete(id) {
        let posts = await Post.getAllPosts();
        posts = posts.filter(post => post.id !== id);

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'posts.json'),
                JSON.stringify(posts),
                'utf-8',
                err => {
                    if (err) reject(err);
                    else {
                        resolve();
                    }
                }
            );
        });
    }
}

module.exports = Post;
