// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.MovieThumb = Backbone.View.extend({

    thumbsTemplate: _.template([
	"<% titles.each(function(title) { %>",
	    "<%= titleTemplate(title.toJSON()) %>",
	"<% }); %>",
    ].join('')),
    // render the View

	// set the view element ($el) HTML content using its template
	render: function(){
        this.template = _.template(splat.thumbMarkup);

        // set the view element ($el) HTML content using its template
	var moviesMarkup = this.thumbsTemplate({
		titles: this.collection,
		titleTemplate: this.template,
	});
        this.$el.append(moviesMarkup);
        return this;    // support method chaining
    }

});
