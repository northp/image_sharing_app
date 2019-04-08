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
    var sql = `SELECT * FROM users WHERE username = "${username}" AND password = "${password}"`;
    connection.query(sql, function(error, results){
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
    var sql = `INSERT INTO users (firstname, surname, username, password) VALUES ("${firstname}", "${surname}", "${username}", "${password}")`;
    connection.query(sql, function(error, results){
        if (error){
            console.log(sql);
            res.render("error.ejs");
        }
        /*else if (results.length == 0){
            res.redirect("http://localhost:8082/signup.html")
        }*/
        else {
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

// route to upload images - backup
//app.post("/upload", function(req, res) {
//    var username = req.session.user;
//    var file = req.files.uploadedImage;
//    console.log(file);
//    file.mv("assets/uploads/"+file.name);
//    res.render("reupload.ejs", {"myFile": file.name, "username": username});
//});

// route to upload images
app.post("/upload", function(req, res) {
    var file = req.files.upload;
    var filename = file.name;
    var username = req.session.user;
    var dateOfUpload = new Date();
    var sql = `INSERT INTO uploads (filename, username, uploadDate) VALUES ("${filename}", "${username}", "${dateOfUpload}")`;
    connection.query(sql, function(error, results){
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
    var sql = `SELECT filename, username FROM uploads ORDER BY uploadDate DESC`;
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
            res.render("archive.ejs", {"uploads": archive, "uploader": archive});
        }
    })
});


// a get route to display all images uploaded by a specific user
app.get("/profile/:id", function (req, res){
    var username = req.params.id;
    var sql = `SELECT filename FROM uploads where username = "${username}" ORDER BY uploadDate DESC`;
    connection.query(sql, function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results.length > 0) {

            var profileUploads = [results.length];
            for(var result in results){
                console.log(results);
                profileUploads[result] = results[result];
            }
            res.render("profileUploads.ejs", {"images": profileUploads, "userID": username});
        }
    })
});

// a get route to see all info about a certain image
app.get("/image/:id", function (req, res) {
    var filename = req.params.id;
    var sql = `SELECT * FROM uploads where filename = "${filename}"`;
    connection.query(sql, function(error, results){
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


// test - AJAX
app.get("/like", function(req, res){
    var sql =  `SELECT totalLikes FROM uploads`;
    connection.query(sql, function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results){
            var number = results[0];
            res.json(number.totalLikes);
        }
    })
});



// test route to see if I can get image details by ID for ajax calls.
// work off this one, might be promising for post route:
// check username against details of image.
// Also check against a likes table to see if he has already liked this id
app.get("/image/:id/like", function (req, res) {
    var filename = req.params.id;
    var sql = `SELECT * FROM uploads where filename = "${filename}"`;
    connection.query(sql, function(error, results){
        if (error){
            res.render("error.ejs");
        }else if (results.length == 0){
            res.render("error.ejs");
        }else if (results) {
            var info = results;
            res.json(info);
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

// configure port, start server
var port = 8082;
app.listen(port);
console.log("Server running on http://localhost:"+port);