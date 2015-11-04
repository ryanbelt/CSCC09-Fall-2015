/**
 * Created by ryan on 11/3/2015.
 */
// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Reviewer = Backbone.View.extend({

    // render the View
    render: function () {
        // set the view element ($el) HTML content using its template
        this.$el.html(this.template());
        return this;    // support method chaining
    },

    initialize:function(){
        this.review=new splat.Review();
        console.log(this.id);
        this.review.set('movieId',this.id);
    },

    events:{
        'click #reviewsave': 'save',
        'change' : "inputChange",
    },

    save:function(){
        var i = this._allValidation();
        if (i==0){
            //reset last edit date
            console.log(this.review);
            this.review.save ({},{wait:true,
                success: function(review,response){
                    //splat.app.navigate('#movies/'+this.id+'/reviews' , {replace:true, trigger:true});
                    splat.app.navigate('#movies' , {replace:true, trigger:true});
                    splat.utils.showNotice('Success:','success',"Review has been saved");
                },
                error: function(model, response) {
                    // display the error response from the server
                    //splat.utils.requestFailed(response);
                    splat.utils.showNotice('Failur:', "danger", "Something wrong with saving review");
                }
            });
        }
        else{
            splat.utils.showNotice("Warning:","warning"," please fix your input(s) ");
        }
    },

    inputChange:function(){

    },

    _allValidation: function(){
        var i =0;
        var field = "";
        var value = "";
        var changed={};
        var allInput = document.getElementsByClassName("form-control");
        var length= allInput.length;
        for (var k=0; k<length;k++){
            field = allInput[k].id;
            value = allInput[k].value;
            changed={};
            var validation = this.review.validateField(field,value);
            if(!validation.isValid){
                splat.utils.addValidationError(field, validation.message);
                i+=1;
            }
            else{
                changed[field]=value;
                splat.utils.removeValidationError(field);
                this.review.set(changed);
            }
        }
        allInput = document.getElementsByClassName("option");
        if(!(allInput[0].checked) &&!( allInput[1].checked)){
            splat.utils.addValidationError("fresh", "please check one of the freshness");
            i+=1;
        }
        else{
            changed={};
            if(allInput[0].checked) {
                changed['freshness'] = 1;
            }
            else{
                changed['freshness'] = 0;
            }
            splat.utils.removeValidationError("fresh");
            this.review.set(changed);
        }
        return i;
    }

});