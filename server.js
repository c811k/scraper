var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("https://www.latimes.com").then(function(response) {
        var $ = cheerio.load(response.data);

        $("h5").each(function(i, element) {
            var result = {};

            result.headline = $(element).find("a").text();
            result.link = $(element).find("a").attr("href");
            result.summary = $(element).children(".summary").text();
            console.log(result);

            db.Article.create(result).then(function(data) {
                console.log(data);
            }).catch(function(err) {
                console.log(err);
            });
        });
        res.send("scraped complete");
    });
});

app.put("/articles/:id", function(req, res) {
    db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        saved: true
    }).then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(data) {
        res.json(data);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comments")
        .then(function(data) {
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
});

app.get("/saved", function(req, res) {
    db.Article.find({ saved: true })
        .populate("comments")
        .then(function(data) {
            res.json(data);
        }).catch(function(err) {
            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body).then(function(dbComment) {
        return db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            $push: {comments: dbComment._id}
        }, {
            new: true
        });
    }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.delete("/clear", function(req, res) {
    db.Article.deleteMany({}).catch(function(err) {
        res.json (err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});
