/**
 * Created by ryan on 11/4/2015.
 */
// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.ReviewThumb = Backbone.View.extend({
    //teacher given code, still need to figure why
    thumbsTemplate: _.template([
        "<% titles.each(function(title) { %>",
        "<%= titleTemplate(title.toJSON()) %>",
        "<% }); %>",
    ].join('')),
    // render the View

    // set the view element ($el) HTML content using its template
    /*render: function(){
        this.loadThumbTemplate =$.get('tpl/ReviewThumb.html');

        //teacher given code, still need to figure why
        this.loadThumbTemplate.done(function(markup){
            splat.thumbMarkup=markup;
            this.template = _.template(splat.thumbMarkup);
        });


        // set the view element ($el) HTML content using its template
        var moviesMarkup = this.thumbsTemplate({
            titles: this.collection,
            titleTemplate: this.template,
        });
        this.$el.append(moviesMarkup);
        return this;    // support method chaining
    }*/
    render: function () {
        // set the view element ($el) HTML content using its template
        this.$el.html(this.template());
        return this;    // support method chaining
    }

});
