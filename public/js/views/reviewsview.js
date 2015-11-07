
// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.ReviewsView = Backbone.View.extend({

    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
    this.showScore();
	this.$el.html(this.template(this.red));
	return this;    // support method chaining
    },

    initialize: function () {
        this.red={ret:"",pic:""};
        this.listenTo(this.collection, "sync", this.render);
    },

    showScore: function(){
        var score=0;
        var length=this.collection.length;
        var self=this;
        if(length < 1){
            self.red={'ret':'...No reviews yet!!','pic':'','total':''};
        }else{
            var movie=new splat.Movie({_id:self.id});
            for (var k=0; k<length;k++){

                score+=self.collection.models[k].get('freshness');
            }
            var rounded = Math.round( score/length *100 * 10 ) / 10;
            if(rounded >=50){
                var pic='img/fresh.gif';
            }
            else{
                var pic='img/rotten.gif';
            }
            movie.fetch({success:function(movie,response){

                if(movie.freshTotal != length){
                    movie.set('freshTotal',length);
                    movie.set('freshVotes',score);
                    movie.save();
                }
            }});
            this.red={'ret':'Current Score:'+rounded+'%','pic':pic,'total':length};
        }
    }


});
