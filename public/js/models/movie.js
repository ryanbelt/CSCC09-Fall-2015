'use strict';

var splat =  splat || {};  // our app's namespace

splat.Movie = Backbone.Model.extend({
	    // match localStorage use of _id 
      // rather than id
      urlRoot: "/movies",
      idAttribute: "_id",


      defaults: {

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
      	poster : "img/placeholder.jpg",  // movie-poster image URL
      	dated: new Date()  // date of movie posting
      },

        initialize: function () {
          this.validators={};

      },

  

});
