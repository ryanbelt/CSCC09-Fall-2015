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
        "movies/add":"adds",
        "movies/:id":"edits",
        "movies/:id/reviews":"comments",
        "*default": "home"
    },

    initialize: function() {
        // instantiate a Header view
        this.headerView = new splat.Header();
        // insert the rendered Header view element into the document DOM
        $('.header').html(this.headerView.render().el);
        this.movies = new splat.Movies();
        $('#add-header').hide();
        splat.utils.hideNotice();
    },

    comments: function(id){
        $('.header').html(this.headerView.selectMenuItem('add-header'));
        //create review collection with all the review movie id same as current movie id
        this.reviews= new (splat.Reviews.extend({url: "/movies/"+id+"/reviews"}));
        this.reviews.fetch({wait: true,
            success:function(reviews){
                var reviewerView = new splat.Reviewer({id:id, model: new splat.Review(), collection:reviews});
                $('#content').html(reviewerView.render().el);
                splat.utils.showNotice('Success:','success'," Reviews loading Finish!!");
            },
            error:function(reviews,response){
                splat.utils.showNotice('Failure:','danger'," Unable to load");
            }
        });
        //put the collection and model into the detail html

    },
    // When an instance of an AppRouter is declared, create a Header view

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
        splat.utils.hideNotice();
        $('.header').html(this.headerView.selectMenuItem('about-header'));
        if(!this.aboutView){
            this.aboutView = new splat.About();
        };
        $('#content').html(this.aboutView.render().el);
    },


    browse:function(){
        var self = this;
        $('.header').html(this.headerView.selectMenuItem('browse-header'));
        splat.utils.showNotice('Note:','info'," Loading.....");
        //change nav bar section and load the borwse page
        this.movies.fetch({wait: true,
            success:function(movies,response){
                var browseView = new splat.MovieThumb({collection: movies});
                $('#content').html(browseView.render().el); 
                splat.utils.showNotice('Success:','success'," Browse loading Finish!!");
            },
            error:function(){
                splat.utils.showNotice('Failure:','danger'," Unable to load");
            }
        });
    },
    adds:function(){
        //change nav bar section
        $('.header').html(this.headerView.selectMenuItem('add-header'));
        var m=new splat.Movie();
        //put the collection and model into the detail html
        this.containDetailsView = new splat.Details({model: m});
        $('#content').html(this.containDetailsView.render().el);
        $('#moviereview').remove();
    },

    edits:function(id){
        //change nav bar section
        $('.header').html(this.headerView.selectMenuItem('add-header'));
        //get the model by id form the collection
        var self=this;
        m=new splat.Movie({_id:id});
        m.fetch({wait:true, success:function(m){
            //put the collection and model into the detail html
            self.containDetailsView = new splat.Details({model: m});
            $('#content').html(self.containDetailsView.render().el);
        }});

    },
});

// Load HTML templates for Home, Header, About views, and when
// template loading is complete, instantiate a Backbone router
// with history.
splat.utils.loadTemplates(['Home', 'Header', 'About' ,'MovieThumb', 'Details',"Reviewer","ScoreView","ReviewThumb",'Signin','Signup'], function() {
    splat.app = new splat.AppRouter();
    Backbone.history.start();
});