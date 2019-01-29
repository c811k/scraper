var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        require: true,
        unique: true
    },
    summary: {
        type: String
    },
    link: {
        type: String,
        require: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    saved: {
        type: Boolean,
        default: false,
        require: true
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;