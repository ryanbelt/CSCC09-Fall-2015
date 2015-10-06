// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({

	events:{
    	  'click #moviesave': 'save',
    	  'click #moviedel': 'delete',
          'change    .form-input' : "save",
    },


    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template());
    this.delegateEvents();
	return this;    // support method chaining
    },

    save: function(e){
        this.movies=new splat.Movies();
        var data = new splat.Movie({_id: this.$("#title").val()});


        
        data.set("title", this.$("#title").val());
        data.set("released" , this.$("#released").val());
        data.set("director" , this.$("#director").val());
        data.set("rating" , this.$("#rating").val());
        var star=(this.$("#starring").val()).split(",");
        data.set("starring" , star);
        data.set("duration" , this.$("#duration").val());
        var genre=(this.$("#genres").val()).split(",");
        data.set("genre" , genre);
        data.set("synopsis" , this.$("#synopsis").val());
        data.set("trailer" , this.$("#trailer").val());
        splat.utils.showNotice('success','danger',":::good");
        this.movies.create(data)
        console.log(data);

        this.movies.fetch();
    },

    delete: function(){
        this.movies=new splat.Movies();
        this.movies.fetch();
        splat.utils.showNotice('success','danger',":::good");
        this.movies.get({_id:this.$("#title").val() }).destroy({
    wait: true,  // don't destroy client model until server responds
    success: function(model, response) {
    // later, we'll navigate to the browse view upon success
        splat.app.navigate('#', {replace:true, trigger:true});
    // notification panel, defined in section 2.6
        //splat.utils.showNotice('Success', "Movie deleted", 'alert-success')
    },
    error: function(model, response) {
    // display the error response from the server
        splat.utils.requestFailed(response);
    }
});

    }
});
