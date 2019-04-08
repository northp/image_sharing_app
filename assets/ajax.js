"use strict";


function countLikes(){
    $.ajax( {
            url: "http://localhost:8082/like",
            success: function(result) {
                console.log(result);
                $("#test").empty();
                var phrase = document.createElement("p");
                $(phrase).text(result);
                $(phrase).appendTo($("#test"));
            }
        }
    );
}
//
// function getImageData(){
//     $.ajax( {
//             url: "http://localhost:8082/like/:id/like",
//             success: function(result) {
//                 console.log(result);
//                 $("#test").empty();
//                 var phrase = document.createElement("p");
//                 $(phrase).text(result);
//                 $(phrase).appendTo($("#test"));
//             }
//         }
//     );
// }