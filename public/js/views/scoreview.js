/**
 * Created by ryan on 11/13/2015.
 */

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.ScoreView = Backbone.View.extend({

    // render the View
    render: function () {
        // set the view element ($el) HTML content using its template
        this.showScore();
        this.$el.html(this.template(this.red));
        return this;    // support method chaining
    },

    initialize: function () {
        this.red={};
    },

    showScore: function(){
        var score= this.model.get('freshVotes');
        var length= this.model.get('freshTotal');
        if(length!=0){
            var rounded = Math.round( score/length *100 * 10 ) / 10;
            if(rounded >=50){
                var pic='img/fresh.gif';
            }
            else{
                var pic='img/rotten.gif';
            }
            this.red={'ret':'Current Score:'+rounded+'%','pic':pic,'total':length};
        }
        else{
            this.red={ret:'No Reviews yet.....',pic:'',total:0};
        }

    }


});
