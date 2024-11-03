const Post = {
    slug: {type: String, reguired: true, unique: true},
    email: {type: String, reguired: true, unique: true},
    title: {type: String, reguired: true, unique: false},
    description: {type: String, reguired: true, unique: false},
    imageUrl: {type: String, reguired: false, unique: true},
    date: {type: String, required: true, unique: false},
    modifyDate: {type: String, required: true, unique: false},
    readTime: {type: Number, reguired: true, unique: false},
    viewsCount: {type: Number, reguired: true, unique: false},
};

export default Post;
