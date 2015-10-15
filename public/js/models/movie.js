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
      	poster : "img/placeholder.png",  // movie-poster image URL
      	dated: (new Date).toISOString().substr(0,10)// date of movie posting
      },

        initialize: function () {
          this.validators={};

          var stringRegex = /^[a-zA-Z0-9 \,\.\?\-\'\*\!]+$/;
          var yearRegex = /^(19[1-9]\d|200\d|201[0-6])$/;
          var specialRegex = /^[a-zA-Z0-9 \,\-\']+$/;
          var ratingRegex = /^G$|^PG$|^PG-13$|^R$|^NC-17$|^NR$/;
          var durationRegex = /^[1-9][0-9]{1,2}$|^\d$/;
          var synRegex = /\w+/;
          var postiveRegex =/^\d*\.\d{2}$/;
          var urlRegex = /^$|(https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?/;

          this.validators.title = function (value) {
              return ((value && stringRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "name require,Only 1 or more letters-digits-spaces allowed"});
          },

          this.validators.released = function (value) {
              return ((value && yearRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "Year should be digit in range of 1910~2016"});
          },

          this.validators.director = function (value) {
              return ((value && stringRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "name require, Only 1 or more letters-digits-spaces allowed"});
          },

          this.validators.starring = function (value) {
              return ((value && specialRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "could not be empty, for more seperated by ','"});
          },

          this.validators.genre = function (value) {
              return ((value && specialRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "could not be empty, for more seperated by ','"});
          },

          this.validators.rating = function (value) {
              return ((value && ratingRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "MPAA movie rating require(G, PG, PG-13, R, NC-17, NR) "});
          },

          this.validators.duration = function (value) {
              return ((value && durationRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "should be digit in range of 0~999"});
          },

          this.validators.synopsis = function (value) {
              return ((value && synRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "could not be empty"});
          },

          this.validators.freshTotal = function (value) {
              return ((value && synRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "freshTotal should be not negative"});
          },

          this.validators.freshVotes = function (value) {
              return ((value && synRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "freshVotes should be not negative"});
          },

          this.validators.trailer = function (value) {
              return ((urlRegex.test(value))?{isValid: true}
              : {isValid: false, 
                message: "empty string or a properly-formatted URL"});
          },

          this.validators.dated = function (value) {
              return {isValid: true};
          },

          this.validators.poster = function(value){
            return {isValid: true};
          }

      },

      validateField: function(field, value){
          return this.validators[field](value);
      },

      /*fullValidation: function(){
        var i=0;
        for (var field in this.validators){
          var validation=this.validators[field](this.get(field));
          console.log(validation);
          if(!validation.isValid){
            splat.utils.addValidationError(field,validation.message);
            i+=1;
          }else{
            splat.utils.removeValidationError(field);
          }
        }
        console.log(i);
        return i;
      }*/
});
