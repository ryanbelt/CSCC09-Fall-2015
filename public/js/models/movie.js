'use strict';

var splat =  splat || {};  // our app's namespace

splat.MovieModel = Backbone.Model.extend({
	    // match localStorage use of _id 
      // rather than id
      idAttribute: "_id",


      defaults: {
        /*
        title: '', //movie title
        released: null, //release year in Date
        director:'', //movie's director
        starring:[], // array principal actors
        rating:'', // MPAA movie rating: G, PG, PG-13, R, NC-17, NR
      	duration :null,   // run-time in minutes in number
     	  genre: [],  // genre terms, e.g. action, comedy, etc
      	synopsis: "",// brief outline of the movie
      	freshTotal : 0.0,// cumulative total of review fresh (1.0) votes
      	freshVotes : 0.0,  // number of review ratings
      	trailer : null,  // URL for trailer/movie-streaming
      	poster : "img/placeholder.png",  // movie-poster image URL
      	dated: new Date()  // date of movie posting
        */
        title (string: "")  // movie title
      released (Date: null)  // release year
      director (string: "")  // movie's director
      starring (string array: [])  // array principal actors
      rating (string: "")  // MPAA movie rating: G, PG, PG-13, R, NC-17, NR
      duration (number: null)   // run-time in minutes
      genre (string array: [])   // genre terms, e.g. action, comedy, etc
      synopsis (string: "")  // brief outline of the movie
      freshTotal (number: 0.0)   // cumulative total of review fresh (1.0) votes
      freshVotes (number: 0.0)   // number of review ratings
      trailer (string: null)  // URL for trailer/movie-streaming
      poster (string: "img/placeholder.png")  // movie-poster image URL
      dated (Date: new Date() )  // date of movie posting

      }
});