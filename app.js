"use strict";


// require middleware
var express = require("express");
var mysql = require("mysql");
var bodyparser = require("body-parser");
var session = require("express-session");
var fileUpload = require("express-fileupload");

// configure middleware & create templates folder

var app = express();
app.set("view-engine","ejs");
app.set("views", "templates");
app.use(express.static("assets"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(session({
    secret:'kajfhaoudfbakdjfbadf',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:100000}
}));
app.use(fileUpload());

app.use(function(request, response, next) {
    console.log(request.url);
    next();
});


// // configure database connection - tcd
// var connection = mysql.createConnection({
//     host: "mysql.scss.tcd.ie",
//     user: "northp",
//     password: "hahle1Op",
//     database: "northp_db"
// });

// configure database connection - local MAMP
var connection = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    user: "root",
    password: "root",
    database: "northp_db"
});

// connect to DB
connection.connect(function(error){
    if(error){
        console.log("Error: "+error);
    } else {
        console.log("Connected successfully to Database");
    }
});

// configure routes
// login
app.post("/login", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    // var sql = `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`;
    // connection.query(sql, function(error, results){
    var sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    connection.query(sql, [username, password], function(error, results){
        if(error) {
            res.render("error.ejs");
        }
        else if(results.length == 0) {
            res.redirect("http://localhost:8082/login.html");
        } else if (results.length > 0) {
            req.session.user = username;
            res.render("home.ejs", {"username": username});
        }
    })
});







// a route to allow a person to sign up as a user (this creates a user in the database)
app.post("/signup", function(req, res){
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var username = req.body.username;
    var password = req.body.password;
    //var sql = `INSERT INTO users (firstname, surname, username, password) VALUES ("${firstname}", "${surname}", "${username}", "${password}")`;
    //connection.query(sql, function(error, results){
    var sql = `INSERT INTO users (firstname, surname, username, password) VALUES (?, ?, ?, ?)`;
    connection.query(sql,[firstname, surname, username, password], function(error){
        if (error){
            console.log(sql);
            res.render("error.ejs");
        } else {
            req.session.user = username;
            res.render("profile.ejs", {"username": username});
        }
    })
});




// get user profle if user is logged in
app.get("/profile", function(req, res) {
    var username = req.session.user;
    if (username) {
        res.render("profile.ejs", {"username": username})
    } else {
        res.redirect("http://localhost:8082/login.html");
    }
});

// get homepage, render ejs if user logged in
app.get("/home", function(req, res) {
    var username = req.session.user;
    if (username) {
        res.render("home.ejs", {"username": username})
    } else {
        res.redirect("/");
    }
});

// route to go to upload page if user is logged in
app.get("/upload", function(req, res){
    var username = req.session.user;
    if (username) {
        res.render("upload.ejs", {"username": username})
    } else {
        res.redirect("http://localhost:8082/login.html");
    }
});


// route to upload images
app.post("/upload", function(req, res) {
    var file = req.files.upload;
    var filename = file.name;
    var username = req.session.user;
    var dateOfUpload = new Date();
    // var sql = `INSERT INTO uploads (filename, username, uploadDate, totalLikes, totalComments) VALUES ("${filename}", "${username}", "${dateOfUpload}", "${0}","${0}")`;
    // connection.query(sql, function(error, results){
    var sql = `INSERT INTO uploads (filename, username, uploadDate, totalLikes, totalComments) VALUES (?, ?, ?, ?, ?)`;
    connection.query(sql,[filename, username, dateOfUpload, 0, 0], function(error, results){
        if (error){
            res.render("error.ejs");
        }
        else {
            file.mv("assets/uploads/"+file.name);
            res.render("reupload.ejs", {"myFile": file.name, "username": username});
        }
    })
});

// logout and redirect to home.
app.get("/logout", function(req, res) {
    req.session.destroy();
    res.render("logout.ejs");
});


// a get route to display archive of images uploaded to the site
app.get("/home/archive", function(req, res){
    var sql = `SELECT filename, username, totalLikes, totalComments FROM uploads ORDER BY uploadDate DESC`;
    connection.query(sql, function(error, results){
        if(error) {
            res.render("error.ejs");
        }
        else if(results.length == 0) {
            res.render("archiveEmpty.ejs");
        } else if (results.length > 0) {

            var archive = [results.length];
            for(var result in results){
                archive[result] = results[result];
            }
            res.render("archive.ejs", {"uploads": archive});
        }
    })
});


// a get route to display all images uploaded by a specific user
app.get("/profile/:id", function (req, res){
    var username = req.params.id;
    // var sql = `SELECT filename FROM uploads where username = "${username}" ORDER BY uploadDate DESC`;
    // connection.query(sql, function(error, results){
    var sql = `SELECT filename FROM uploads where username = ? ORDER BY uploadDate DESC`;
    connection.query(sql, [username], function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results.length > 0) {

            var profileUploads = [results.length];
            for(var result in results){
                console.log(results);
                profileUploads[result] = results[result];
            }
            res.render("profileUploads.ejs", {"images": profileUploads, "userID": username});
        }else if(results.length==0){
            res.render("profileUploadsEmpty.ejs", {"userID": username});
        }
    })
});

// a get route to see all info about a certain image
app.get("/image/:id", function (req, res) {
    var filename = req.params.id;
    // var sql = `SELECT * FROM uploads where filename = "${filename}"`;
    // connection.query(sql, function(error, results){
    var sql = `SELECT * FROM uploads where filename = ?`;
    connection.query(sql, [filename], function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results.length == 0){
            res.render("error.ejs");
        }else if (results) {
            var info = results;
            res.render("image.ejs", {"info": info, "filename": info}); // create this ejs
        }
    })
});



// a get route to list all user profiles
app.get("/users", function(req, res){
    var sql =  `SELECT username FROM users`;
    connection.query(sql, function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results){
            var userList = [results.length];
            for(var result in results){
                userList[result] = results[result];
            }
            res.render("users.ejs", {"Users": userList}); // create this ejs
        }
    })
});

// get route to query DB for total likes relative to a specific upload
app.get("/image/totalLikes/:id", function(req, res){
    var filename = req.params.id;
    // var sql =  `SELECT totalLikes from uploads WHERE filename = "${filename}"`;
    // connection.query(sql, function(error, results){
    var sql =  `SELECT totalLikes from uploads WHERE filename = ?`;
    connection.query(sql, [filename], function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results.length>0){
            console.log(results);
            console.log(`http://localhost:8082/image/totalLikes/${filename}`);
            res.json(results[0].totalLikes);
        }
    })
});

// get route to see if a logged in user has liked an image.
// says "Liked!" if they have, "Like?" if they haven't. "Like" if no session data.
app.get("/image/checkLikeStatus/:id", function(req,res){
    var username = req.session.user;
    var filename = req.params.id;
    if(username){
        // var SQL = `SELECT liker, liked_image, like_status from likes WHERE liker = "${username}" AND liked_image = "${filename}"`;
        // connection.query(SQL, function(error, results){
        var SQL = `SELECT liker, liked_image, like_status from likes WHERE liker = ? AND liked_image = ?`;
        connection.query(SQL, [username, filename],function(error, results){
            if(error){
                console.log(error);
                res.render("error.ejs");
            } else if (results.length>0) {
                console.log(results);
                if(results[0].like_status == 1){
                    res.json("Liked!");
                } else if(results[0].like_status == 0){
                    res.json("Like?");
                }
            }
        })
    }
});

// get route to like an image. If a user is logged in,
// this route also checks if they have liked an image before.
// If they press the like button again, it will be unliked.
// this needs to be updated so that it uses multiple SQL statements:
// update likes and update uploads
app.get("/image/like/:id", function(req,res){
    var username = req.session.user;
    var filename = req.params.id;
    if(username){
        // var SQL = `SELECT liker, liked_image, like_status from likes WHERE liker = "${username}" AND liked_image = "${filename}"`;
        // connection.query(SQL, function(error, results){
        var SQL = `SELECT liker, liked_image, like_status from likes WHERE liker = ? AND liked_image = ?`;
        connection.query(SQL, [username, filename], function(error, results){
            if(error){
                console.log(error);
                res.render("error.ejs");
            }else if(results.length==0){
                // var SQL_INSERT = `INSERT INTO likes (liker, liked_image, like_status) VALUES("${username}", "${filename}", '1');
                // UPDATE uploads SET totalLikes = totalLikes+1 WHERE filename = "${filename}";`;
                // connection.query(SQL_INSERT, function(error){
                var SQL_INSERT = `INSERT INTO likes (liker, liked_image, like_status) VALUES(?, ?, ?);
                UPDATE uploads SET totalLikes = totalLikes+1 WHERE filename = ?;`;
                connection.query(SQL_INSERT, [username, filename, 1, filename], function(error){
                    if (error){
                        console.log(error);
                    } else {
                        console.log("Inserted new like row for this user and this image, set like_status to 1");
                    }
                })
                res.json('Liked!');
            } else if(results.length == 1){
                if (results[0].like_status == 1) {
                    // var SQL_Update = `UPDATE likes SET like_status = like_status-1 WHERE liker = "${username}" AND liked_image = "${filename}";
                    //                     UPDATE uploads SET totalLikes = totalLikes-1 WHERE filename = "${filename}";`;
                    //connection.query(SQL_Update, function (error) {
                    var SQL_Update = `UPDATE likes SET like_status = like_status-1 WHERE liker = ? AND liked_image = ?;
                                        UPDATE uploads SET totalLikes = totalLikes-1 WHERE filename = ?;`;
                    connection.query(SQL_Update, [username, filename, filename], function (error) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Updated to 0, decrement results[0].like_status");
                        }
                    })
                } else if (results[0].like_status == 0) {
                    // SQL_Update = `UPDATE likes SET like_status = like_status+1 WHERE liker = "${username}" AND liked_image = "${filename}";
                    //                 UPDATE uploads SET totalLikes = totalLikes+1 WHERE filename = "${filename}";`;
                    // connection.query(SQL_Update, function (error) {
                    SQL_Update = `UPDATE likes SET like_status = like_status+1 WHERE liker = ? AND liked_image = ?;
                                    UPDATE uploads SET totalLikes = totalLikes+1 WHERE filename = ?;`;
                    connection.query(SQL_Update, [username, filename, filename], function (error) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Updated to 1, increment results[0].like_status");
                        }
                    })
                }
                if(results[0].like_status == 1){
                    res.json("Like?");
                } else if(results[0].like_status == 0){
                    res.json("Liked!");
                }
            }
        })
    }
});

// get route to query DB for total comments relative to a specific upload
app.get("/image/totalComments/:id", function(req, res){
    var filename = req.params.id;
    // var sql =  `SELECT totalComments from uploads WHERE filename = "${filename}"`;
    // connection.query(sql, function(error, results){
    var sql =  `SELECT totalComments from uploads WHERE filename = ?`;
    connection.query(sql, [filename], function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results.length>0){
            console.log(results);
            console.log(`http://localhost:8082/image/totalComments/${filename}`);
            res.json(results[0].totalComments);
        }
    })
});

// display all comments made on a specific image
app.get("/image/getComments/:id", function(req, res){
   var filename = req.params.id;
   // var SQL = `SELECT commenter, comment FROM comments WHERE commented_image = "${filename}";`;
   // connection.query(SQL, function(error, results){
    var SQL = `SELECT commenter, comment FROM comments WHERE commented_image = ?;`;
    connection.query(SQL, [filename], function(error, results){
       if(error){
           res.render("error.ejs");
       } else {
           console.log(results);
           res.json(results);
       }
   })
});



// post route to post comments if user is logged in
app.post("/image/comment/:id", function(req, res){
    var filename = req.params.id;
    var comment = req.body.value;
    var username = req.session.user;
    if(username){
        // var SQL = `INSERT INTO comments (commenter, commented_image, comment) VALUES ("${username}", "${filename}", "${comment}");
        // UPDATE uploads SET totalComments = totalComments+1 WHERE filename = "${filename}";`;
        // connection.query(SQL, function(error){
        var SQL = `INSERT INTO comments (commenter, commented_image, comment) VALUES (?, ?, ?);
        UPDATE uploads SET totalComments = totalComments+1 WHERE filename = ?;`;
        connection.query(SQL, [username, filename, comment, filename], function(error){
            if (error){
                console.log(error);
            } else {
                console.log(comment);
                res.json({
                    'text': comment,
                    'user': username
                });

            }
        })
    }
});


// configure port, start server
var port = 8082;
app.listen(port);
console.log("Server running on http://localhost:"+port);








