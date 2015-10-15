// catch simple errors
"use strict";

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({

	events:{
    	  'click #moviesave': 'save',
    	  'click #moviedel': 'delete',
          'change' : "inputChange",
    },


    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template(this.model.toJSON()));
    this.delegateEvents();
	return this;    // support method chaining
    },

    save: function(event){
        event.preventDefault();
        var title=this.$("#title").val();
        var i = 0;
        i= this._allValidation();
        if (i==0){
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
        }
        else{
            splat.utils.showNotice("Warning:","warning"," please fix your input(s) ");
        }
    },

    delete: function(event){

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

    },

    inputChange: function(event){
        var field = event.target.id;
        var value = event.target.value;
        //console.log(field, value);
        var changed={};
        //console.log(changed);
        var validation = this.model.validateField(field,value);
        if(!validation.isValid){
            splat.utils.addValidationError(field, validation.message);
        }
        else{
            splat.utils.removeValidationError(field);
            if("genre"===field || "starring"===field){
                    var values = value.split(",");
                    changed[field]=values;
                }
                else{changed[field]=value;}
            this.model.set(changed);
            splat.utils.showNotice("Note:","info"," click save before leaving the page");
        }
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
            var validation = this.model.validateField(field,value);
            if(!validation.isValid){
                splat.utils.addValidationError(field, validation.message);
                i+=1;
            }
            else{
                if("genre"===field || "starring"===field){
                    var values = value.split(",");
                    changed[field]=values;
                }
                else{changed[field]=value;}
                splat.utils.removeValidationError(field);
                this.model.set(changed);
            }
        }
        return i;
    }
});
