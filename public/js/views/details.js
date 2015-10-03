// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({

	events:{
    	  'click #moviesave': 'save',
    	  'click #moviedel': 'delete',
    },


    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template());
	return this;    // support method chaining
    },

    save: function(e){
        var data = new splat.Movie({_id: this.$("#title").val()});

        /*
        data.set("title", this.$("#title").val());
        data.set("released" , this.$("#released").val());
        data.set("director" , this.$("#director").val());
        data.set("rating" , this.$("#rating").val());
        data.set("starring" , this.$("#starring").val());
        data.set("duration" , this.$("#duration").val());
        data.set("genre" , this.$("#genres").val());
        data.set("synopsis" , this.$("#synopsis").val());
        data.set("trailer" , this.$("#trailer").val());
        */
        console.log(data);
    },

    delete: function(){

    }
});
