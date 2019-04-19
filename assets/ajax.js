"use strict";


// a function to display the total number of likes for a post
function getTotalLikes(filename){
    $.ajax( {
            url: `http://localhost:8082/image/totalLikes/${filename}`,
            success: function(result) {
                console.log(result);
                $("#likes").empty();
                var phrase = document.createElement("p");
                $(phrase).text(result);
                $(phrase).appendTo($("#likes"));
            }
        }
    )
};

// a function to display whether or not a user has previously liked a post
function getLikeStatus(filename){
    $.ajax( {
            url: `http://localhost:8082/image/checkLikeStatus/${filename}`,
            success: function(result) {
                console.log(result);
                $("#liked").empty();
                var phrase = document.createElement("p");
                $(phrase).text(result);
                $(phrase).appendTo($("#liked"));
            }
        }
    )
};

// a function to like an image post
function likeImage(filename){
    $.ajax( {
            url: `http://localhost:8082/image/like/${filename}`,
            success: function(result) {
                console.log(result);
                $("#liked").empty();
                var phrase = document.createElement("p");
                $(phrase).text(result);
                $(phrase).appendTo($("#liked"));
            }
        }
    )
};


// a function to get the total number of comments for an image
function getTotalComments(filename){
    $.ajax( {
            url: `http://localhost:8082/image/totalComments/${filename}`,
            success: function(result) {
                console.log(result);
                $("#comments").empty();
                var phrase = document.createElement("p");
                $(phrase).text(result);
                $(phrase).appendTo($("#comments"));
            }
        }
    )
};

// a function to display all comments posted for an image
function displayComments(filename){
    $.ajax( {
            url: `http://localhost:8082/image/getComments/${filename}`,
            success: function(result) {
                console.log(result);
                for (var i in result){
                    var commenter = document.createElement("h3");
                    $(commenter).text(result[i].commenter + " says: ");
                    $(commenter).appendTo($("#display"));
                    var comment = document.createElement("p");
                    $(comment).text(result[i].comment);
                    $(comment).appendTo($("#display"));
                }

            }
        }
    )
};

// a function to post a comment
function postComment(filename){
    $.ajax({
        url: `http://localhost:8082/image/comment/${filename}`,
        data: {value: $("#textEntry").val()},
        method: "POST",
        success: function (result){
            console.log(result);
            var commenter = document.createElement("h3");
            $(commenter).text(result['user'] + " says: ");
            $(commenter).appendTo($("#display"));
            var comment = document.createElement("p");
            $(comment).text(result['text']);
            $(comment).appendTo($("#display"));
        }
    })
};




