$(document).ready(function() {
    $('.modal').modal();
});

displayArticles();

$("#scrape").on("click", function() {
    clearArticles();
    $.ajax({
        method: "GET",
        url: "/scrape"
    });
});

$("#clear").on("click", function() {
    clearArticles();
});

$("#saved").on("click", function() {
    $("#articles").hide();
    $("#scrape").hide();
    $("#savedArticles").empty();
    $("#savedArticles").show();
    savedArticles();
});

$(document).on("click", "#saveArticle", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "PUT",
        url: "/articles/" + thisId
    }).then(function(data) {
    });
    location.reload();
});

$(document).on("click", "#deleteArticle", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/delete/" + thisId
    });
    $("#articles").hide();
    $("#scrape").hide();
    $("#savedArticles").empty();
    savedArticles();
});

$(document).on("click", "#comment", function() {
    $("#modal-comment").empty();
    $("#comment-footer").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url:"/articles/" +thisId
    }).then(function(data) {
        console.log(data);
        
        var commentInput = $("<form>").addClass("col s12");
        var row = $("<div>").addClass("row");
        var field = $("<div>").addClass("input-field col s12");
        var textarea = $("<textarea>")
            .addClass("materialize-textarea")
            .attr("id", "commentInput");
        var label = $("<label>")
            .attr("for", "textarea1")
            .text("Comments");
        var saveComment = $("<a>")
            .addClass("modal-close waves-effect waves-green btn-flat")
            .attr("data-id", data._id)
            .attr("id", "save-comment")
            .text("Save");

        field.append(textarea, label);
        row.append(field);
        commentInput.append(row);
        $("#modal-comment").append(commentInput);
        $("#comment-footer").append(saveComment);

        if (data.comments) {
            console.log(data.comments);
            var commentDisplay = $("<a>")
                .addClass("waves-effect btn blue-grey disabled")
                .text(data.comments.body);
            var clearButton = $("<a>")
                .addClass("waves-effect waves-blue-grey btn-flat")
                .attr("data-id", data.comments._id)
                .text("X");
            $("#savedComment").append(commentDisplay, clearButton);
        }
    });
});

$(document).on("click", "#save-comment", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#commentInput").val()
        }
    }).then(function(data) {
        console.log(data);
       
    });

});

function displayArticles() {
    $("#savedArticles").hide();
    $.getJSON("/articles", function(data) {
        var latimes = "https://www.latimes.com";
        for (let i = 0; i <data.length; i++) {
            var div = $("<div>")
                .addClass("card blue-grey z-depth-4");
            var content = $("<div>").addClass("card-content white-text");
            var title = $("<span>")
                .addClass("card-title")
                .text(data[i].headline);
            var action = $("<div>").addClass("card-action right-align");
            var link = $("<a>")
                .attr("href", latimes + data[i].link)
                .text("Read More");
            var save = $("<a>")
                .addClass("waves-effect btn-flat blue-grey darken-2")
                .attr("data-id", data[i]._id)
                .attr("id", "saveArticle")
                .text("Save");
            action.append(link, save);
            content.append(title);
            div.append(content, action);
            if (!data[i].saved) {
                $("#articles").append(div);
            }
        }
    });
}

function savedArticles() {
    $("#articles").hide();

    $.getJSON("/saved", function(data) {
        var latimes = "https://www.latimes.com";
        for (let i = 0; i <data.length; i++) {
            var div = $("<div>")
                .addClass("card blue-grey z-depth-4");
            var content = $("<div>").addClass("card-content white-text");
            var title = $("<a>")
                .addClass("card-title")
                .attr("href", latimes + data[i].link)
                .text(data[i].headline);
            var action = $("<div>").addClass("card-action right-align");
            var deleteComment = $("<a>")
                .addClass("waves-effect btn-flat blue-grey darken-2")
                .attr("data-id", data[i]._id)
                .attr("id", "deleteArticle")
                .text("DELETE ARTICLE");
            var comment = $("<a>")
                .addClass("waves-effect btn-flat blue-grey darken-2 modal-trigger")
                .attr("data-id", data[i]._id)
                .attr("id", "comment")
                .attr("href", "#modalComment")
                .text("COMMENTS");
            action.append(deleteComment, comment);
            content.append(title);
            div.append(content, action);
            $("#savedArticles").append(div);
        }
    });
}

function clearArticles() {
    $.ajax({
        method: "DELETE",
        url:"/clear"
    });
    $("#articles").empty();
    $("#savedArticles").empty();
}