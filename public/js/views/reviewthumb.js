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
        "<% reviews.each(function(review) { %>",
        "<%= reviewTemplate(review.toJSON()) %>",
        "<% }); %>",
    ].join('')),
    // render the View

    // set the view element ($el) HTML content using its template
    render: function(){
        this.loadThumbTemplate =$.get('tpl/ReviewThumb.html');

        //teacher given code, still need to figure why
        this.loadThumbTemplate.done(function(markup){
            splat.thumbMarkup=markup;
            this.template = _.template(splat.thumbMarkup);
        });

        console.log("render thumb");
        // set the view element ($el) HTML content using its template
        var reviewsMarkup = this.thumbsTemplate({
            reviews: this.collection,
            reviewTemplate: this.template,
        });
        this.$el.append(reviewsMarkup);
        return this;    // support method chaining
    }

});
