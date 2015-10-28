// catch simple errors

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// Define Backbone router
splat.AppRouter = Backbone.Router.extend({

    // Map "URL paths" to "router functions"
    routes: {
        "": "home",
        "about": "about",
        "movies" :"browse",
        "movies/:id":"edits",
        "movies/add":"edits",
        "movies/:id/reviews":"comments",
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
        this.reviews= new splat.Reviews();
        this.reviews.fetch();
        splat.utils.hideNotice();
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
        splat.utils.showNotice('Note:','info'," Loading.....");
        //change nav bar section and load the borwse page
        this.movies.fetch({
            success:function(movies,response){
                var browseView = new splat.MovieThumb({collection: movies});
                $('#content').html(browseView.render().el); 
            },
            failure:function(){
                splat.utils.showNotice('Failure:','danger'," Bad");
            }
        });
        console.log(this.movies);

        splat.utils.showNotice('Success:','success'," Browse loading Finish!!");
    },

    edits:function(id){
        //change nav bar section
        splat.utils.flush();
        $('.header').html(this.headerView.selectMenuItem('add-header'));
        //get the model by id form the collection
        var m =this.movies.get(id);
        //if model is not exist in the collection, we create a brand new model
        if (!m)
            m=new splat.Movie();
        //put the collection and model into the detail html
        this.containDetailsView = new splat.Details({collection: this.movies , model: m});
        splat.utils.showNotice('Note:','info'," Remember to click SAVE.");
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