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

});