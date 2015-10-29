"use strict";

var fs = require('fs'),
    // path is "../" since splat.js is in routes/ sub-dir
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    url = require("url");

// Implemention of splat API handlers:

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
  res.status(200).send('<h3>Heroz API is running!</h3>');
};

exports.addMovie = function(req, res){
    var movie= new MovieModel(req.body);
    movie.save(function(err,movie){
    if (err) {
        res.status(500).send("Sorry, unable to add movie at this time (" 
            +err.message+ ")" );
    } else if (!movie) {
        res.status(404).send("Sorry, that movie already exist");
    } else {
        res.status(200).send(movie);
    }
    });
};

// retrieve an individual movie model, using it's id as a DB key
exports.getMovie = function(req, res){
    MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            res.status(200).send(movie);
        }
    });
};

exports.getMovies = function(req, res){
    MovieModel.find({}, function(err,movies){
        if (err) {
              res.send(404, "Sorry, no movies were found! ("
                  +err.message+ ")" );
           } else {
              res.status(200).send(movies);
           }
    });
};

exports.editMovie = function(req, res){
    MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
              res.send(404, "Sorry, no movies were found! ("
                  +err.message+ ")" );
           }else if(!movie){
                res.send(404, "Sorry, no movies were found!" );
            }else {
            for(var attr in req.body){
               movie[attr]=req.body[attr];
            }
            console.log(movie);
                movie.save(function(serr,movie){
                    if(serr){
                        res.send("something wrong to add");
                    }else{
                        res.send(movie);
                    }
                });
           }
    });
};

exports.deleteMovie = function(req, res){
    MovieModel.findById(req.params.id, function(err, movie) {
                    console.error(err);
        if(err){
            res.send(500, "Error with finding this movie");
        }else if(!movie){
                res.send(404, "Sorry, no movies were found!" );
            }else{
            movie.remove(function(err){
                if(!err){
                    console.log(req.params.id+"movie delete success");
                    res.status(200).send(movie);
                }else{
                    console.log(req.params.id+"movie delete fail");
                    res.send(404,"cannot delete this movie");
                }
            })
        }
    });
};
// upload an image file; returns image file-path on server
exports.uploadImage = function(req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files.image.path,  // ADD CODE to get file path
        fileType = req.files.image.name,   // ADD CODE to get MIME type
        // extract the MIME suffix for the user-selected file
        suffix = ""; // ADD CODE
        // imageURL is used as the value of a movie-model poster field 
	// id parameter is the movie's "id" attribute as a string value
        imageURL = 'img/uploads/' + req.params.id + suffix,
        // rename the image file to match the imageURL
        newPath = __dirname + '/../public/' + imageURL;
    fs.rename(filePath, newPath, function(err) {
        if (!err) {
            res.status(200).send(imageURL);
        } else {
            res.status(500).send("Sorry, unable to upload poster image at this time (" 
                +err.message+ ")" );
	}
    });
};

var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect(config.db);

// Schemas
var MovieSchema = new mongoose.Schema({
    title:{ type: String, required:true},
    released:{ type: Number, required:true},
    director:{ type: String, required:true},
    starring:{ type: [String], required:true},
    rating:{ type: String, required:true},
    duration:{ type: Number, required:true},
    genre:{ type: [String], required:true},
    synopsis:{ type: String, required:true},
    poster:{ type: String, required:true},
    dated:{ type: String, required:true},
    trailer:{ type: String, required:false},
    freshTotal:{ type: Number, required:true},
    freshVotes:{ type: Number, required:true},
    // ADD CODE for other Movie attributes
});


// Constraints
// each title:director pair must be unique; duplicates are dropped
MovieSchema.index({title:1, director:1},{unique: true});  // ADD CODE

// Models
var MovieModel = mongoose.model('Movie', MovieSchema);