"use strict";



function getTotalLikes(filename){
    $.ajax( {
            // url: "http://localhost:8082/image/totalLikes/:id",
            url: `http://localhost:8082/image/totalLikes/${filename}`,
            success: function(result) {
                console.log(result);
                $("#likes").empty();
                var phrase = document.createElement("p");
                $(phrase).text(result);
                $(phrase).appendTo($("#likes"));
            }
        }
    );
}




// function likeImage(){
//     $.ajax({
//         url: "http://localhost:8082/image/:id",
//         success: function(result){
//             $("#liked").empty();
//             var phrase = document.createElement("p");
//             $(phrase).text(result);
//             $(phrase).appendTo($("#liked"));
//         }
//     })
// }
//
//
// function getTotalComments(){
//     $.ajax( {
//             url: "http://localhost:8082/comment",
//             success: function(result) {
//                 console.log(result);
//                 $("#comments").empty();
//                 var phrase = document.createElement("p");
//                 $(phrase).text(result);
//                 $(phrase).appendTo($("#comments"));
//             }
//         }
//     );
// }

