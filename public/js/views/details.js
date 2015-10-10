// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({

	events:{
    	  'click #moviesave': 'save',
    	  'click #moviedel': 'delete',
          //'change    .form-input' : "save",
    },


    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
    console.log(this.model.toJSON());
	this.$el.html(this.template(this.model.toJSON()));
    this.delegateEvents();
	return this;    // support method chaining
    },

    save: function(e){

        e.preventDefault();
        var title=this.$("#title").val();

        //this.movie.set("id",title);
        this.model.set("title", this.$("#title").val());
        this.model.set("released" , this.$("#released").val());
        this.model.set("director" , this.$("#director").val());
        this.model.set("rating" , this.$("#rating").val());
        var star=(this.$("#starring").val()).split(",");
        this.model.set("starring" , star);
        this.model.set("duration" , this.$("#duration").val());
        var genre=(this.$("#genres").val()).split(",");
        this.model.set("genre" , genre);
        this.model.set("synopsis" , this.$("#synopsis").val());
        this.model.set("trailer" , this.$("#trailer").val());


        //splat.utils.showNotice('Success:','success',title+" has been saved");
        this.collection.create(this.model ,{
            success: function(){
                splat.app.navigate('#movies', {replace:true, trigger:true});
                splat.utils.showNotice('Success:','success',title+" has been saved");
            },
            error: function() {
    // display the error response from the server
        splat.utils.requestFailed(response);
        splat.utils.showNotice('Failur:', "danger", "Something wrong with saving");
        }
        });
    },

    delete: function(e){

    var title=this.$("#title").val();
    this.model.destroy({
    wait: true,  // don't destroy client model until server responds
    success: function(model, response) {
    // later, we'll navigate to the browse view upon success
        splat.app.navigate('#movies', {replace:true, trigger:true});
    // notification panel, defined in section 2.6
        splat.utils.showNotice('Success:', "success", title + ' has been deleted');
    },
    error: function(model, response) {
    // display the error response from the server
        splat.utils.requestFailed(response);
        splat.utils.showNotice('Failur:', "danger", "Something wrong with deletion");
    }
});

    }
});
