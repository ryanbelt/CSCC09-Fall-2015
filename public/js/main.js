// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// Define Backbone router
splat.AppRouter = Backbone.Router.extend({

    // Map "URL paths" to "router functions"
    routes: {
        "": "home",
        "about": "about",
        "movies" :"browse",
        "movies/:id":"details",
        "*default": "home"
    },

    // When an instance of an AppRouter is declared, create a Header view
    initialize: function() {
    // instantiate a Header view
        this.headerView = new splat.Header();  
    // insert the rendered Header view element into the document DOM
        $('.header').html(this.headerView.render().el);
        this.movies = new splat.Movies();
        this.movies.fetch();
    },

    home: function() {
    // If the Home view doesn't exist, instantiate one
        $('.header').html(this.headerView.selectMenuItem('home-header'));
        if (!this.homeView) {
            this.homeView = new splat.Home();
        };
    // insert the rendered Home view element into the document DOM
        $('#content').html(this.homeView.render().el);
    },

    about: function(){
        $('.header').html(this.headerView.selectMenuItem('about-header'));
        if(!this.aboutView){
            this.aboutView = new splat.About();
        };
        $('#content').html(this.aboutView.render().el);
    },


    browse:function(){
        $('.header').html(this.headerView.selectMenuItem('browse-header'));

            this.browseView = new splat.MovieThumb({collection: this.movies});

        $('#content').html(this.browseView.render().el); 
    },

    details:function(id){
        $('.header').html(this.headerView.selectMenuItem('add-header'));
        var m =this.movies.get(id);
        if (!m)
            m=new splat.Movie();
        this.containDetailsView = new splat.Details({collection: this.movies , model: m});

        $('#content').html(this.containDetailsView.render().el); 
    },
});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About' ,'MovieThumb', 'Details'], function() {
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});

splat.loadThumbTemplate =$.get('tpl/MovieThumb.html');
splat.loadThumbTemplate.done(function(markup){
    splat.thumbMarkup=markup;
})