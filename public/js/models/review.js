'use strict';

var splat =  splat || {};  // our app's namespace

splat.Review = Backbone.Model.extend({
	urlRoot: "/movies/:id",
    idAttribute: "_id",

      defaults: {
        freshness: 0.0, // fresh review value 1.0, rotten value 0.0
        reviewName: '',  //name of reviewer
       	reviewAffil:'', // affiliation of reviewer
        reviewText:'', // review comments
        movieId:'' //id of reviewed movie
      },

    initialize: function () {
      this.validators = {};

      var stringRegex = /^[a-zA-Z0-9 \,\.\?\-\'\*\!]+$/;

          this.validators.reviewName = function (value) {
            return ((value && stringRegex.test(value))?{isValid: true}
              : {isValid: false,
              message: "name require,Only 1 or more letters-digits-spaces allowed"});
          },
          this.validators.reviewAffil = function (value) {
            return ((value && stringRegex.test(value))?{isValid: true}
                : {isValid: false,
              message: "name require,Only 1 or more letters-digits-spaces allowed"});
          },
          this.validators.reviewText = function (value) {
            return ((value && stringRegex.test(value))?{isValid: true}
                : {isValid: false,
              message: "name require,Only 1 or more letters-digits-spaces allowed"});
          },
          this.validators.freshness = function(value){
             return {isValid: true};
          },
          this.validators.movieId = function(value){
            return {isValid: true};
          }
    },

    validateField: function(field, value){
      return this.validators[field](value);
    },
});