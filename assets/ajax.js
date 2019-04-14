"use strict";



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

function displayComments(filename){
    $.ajax( {
            url: `http://localhost:8082/image/getComments/${filename}`,
            success: function(result) {
                console.log(result);
                for (var i in result){
                    var commenter = document.createElement("h3");
                    $(commenter).text(result[i].commenter + " says: ");
                    $(commenter).appendTo($("#test"));
                    var comment = document.createElement("p");
                    $(comment).text(result[i].comment);
                    $(comment).appendTo($("#test"));
                }

            }
        }
    )
};

function postComment(filename){
    $.ajax( {
            url: `http://localhost:8082/image/comment/${filename}`,
            success: function(result) {
                console.log(result);
                $("#postComment").empty();
                var phrase = document.createElement("p");
                $(phrase).text(result);
                $(phrase).appendTo($("#postComment"));
            }
        }
    )
};
