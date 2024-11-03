import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    slug: {type: String, reguired: true, unique: true},
    title: {type: String, reguired: true, unique: false},
    description: {type: String, reguired: false, unique: false},
    imageUrl: {type: String, reguired: false, unique: true},
    date: {type: String, required: true, unique: false},
    authorEmail: {type: String, reguired: true, unique: true},
    readTime: {type: Number, reguired: true, unique: false},
    viewsCount: {type: Number, reguired: true, unique: false},
});

if (process.env.NODE_ENV === 'production') {
    postSchema.set('autoIndex', false);
}

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export default Post;
