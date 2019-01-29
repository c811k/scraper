var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = 3000;
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", (req, res) => {
    axios.get("https://www.latimes.com").then( (response) => {
        var $ = cheerio.load(response.data);

        $("h5").each( (i, element) => {
            var result = {};

            result.headline = $(element).find("a").text();
            result.link = $(element).find("a").attr("href");
            result.summary = $(element).children(".summary").text();
            console.log(result);

            db.Article.create(result).then( (data) => {
                console.log(data);
            }).catch( (err) => {
                console.log(err);
            });
        });
        res.send("scraped complete");
    });
});

app.put("/articles/:id", (req, res) => {
    db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        saved: true
    }).then( (data) => {
        res.json(data);
    }).catch( (err) => {
        res.json(err);
    });
});

app.get("/articles", (req, res) => {
    db.Article.find({}).then( (data) => {
        res.json(data);
    }).catch( (err) => {
        res.json(err);
    });
});

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then( (data) => {
            res.json(data);
        }).catch( (err) => {
            res.json(err);
        });
});

app.get("/saved", (req, res) => {
    db.Article.find({ saved: true })
        .populate("comment")
        .then( (data) => {
            res.json(data);
        }).catch( (err) => {
            res.json(err);
        });
});

app.get("/articles/:id", (req, res) => {
    db.Comment.create(req.body).then( (dbComment) => {
        return db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            comment: dbComment._id
        }, {
            new: true
        });
    }).then( (dbArticle) => {
        res.json(dbArticle);
    }).catch( (err) => {
        res.json(err);
    });
});

app.delete("/clear", (req, res) => {
    db.Article.deleteMany({}).catch( (err) => {
        res.json (err);
    });
});

app.listen(PORT, () => {
    console.log("App running on port " + PORT);
});
