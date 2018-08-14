const mongoose = require('mongoose');

// define the schema for our user model
const articleSchema = mongoose.Schema({

        authorID: String,
        isDraft: Boolean,
        headline: String,
        datepublished: Date,
        dateModified : Date,
        about: {
            name: String,
            url: String
        },
        category: String,
        keywords: [String],
        thumbnail: String,
        fullBody: String,
        bodyString: String,
        markdown: String,
        wordCount: Number,
        comments: [{
            commentId: Number,
            name: String,
            email: String,
            content: String
        }],
        likes: [String],
        viewCount: Number    

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Article', articleSchema);