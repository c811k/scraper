displayArticles();

$(document).ready(function() {
    $('.modal').modal();
});


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

$(document).on("click", "#saveArticle", function() {
    console.log("hello");
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "PUT",
        url: "/articles/" + thisId
    }).then( (data) => {
        console.log(data);
    });
    
});

$("#saved").on("click", function() {
    $("#articles").hide();
    $("#scrape").hide();
    $("#savedArticles").empty();
    $("#savedArticles").show();
    $.getJSON("/saved", function(data) {
        var latimes = "https://wwww.latimes.com";
        for (let i = 0; i <data.length; i++) {
            var div = $("<div>")
                .addClass("card blue-grey z-depth-4");
            var content = $("<div>").addClass("card-content white-text");
            var title = $("<span>")
                .addClass("card-title")
                .text(data[i].headline);
            var action = $("<div>").addClass("card-action right-align");
            var deleteComment = $("<a>")
                .addClass("waves-effect btn blue-grey darken-2")
                .attr("data-id", data[i]._id)
                .attr("id", "deleteComment")
                .text("DELETE COMMENTS");
            var comment = $("<a>")
                .addClass("waves-effect btn blue-grey darken-2 modal-trigger")
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
});

$(document).on("click", "#comment", function() {
    $("#modal-comment").empty();
    var commentInput = $("<form>").addClass("col s12");
    var row = $("<div>").addClass("row");
    var field = $("<div>").addClass("input-field col s12");
    var textarea = $("<textarea>").addClass("materialize-textarea");
    var label = $("<label>").attr("for", "textarea1").text("Comments");
    field.append(textarea, label);
    row.append(field);
    commentInput.append(row);
    $("#modal-comment").append(commentInput);

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
                .addClass("waves-effect btn blue-grey darken-2")
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

function clearArticles() {
    $.ajax({
        method: "DELETE",
        url:"/clear"
    });
    $("#articles").empty();
    $("#savedArticles").empty();
}