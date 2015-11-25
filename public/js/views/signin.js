"use strict";

var splat =  splat || {};

splat.Signin = Backbone.View.extend({

    el: '<form id="signinForm" accept-charset="UTF-8">',

    events: {
        "change .signinput" : "change",
        "click .signinSubmit": "signin",
        "click .signoutSubmit": "signout"
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    /**
      * @param {Event} e   the change event
      */
    change: function (event) {
        // Remove any existing alert messages
        if (!this.model) {
            // create model to hold auth credentials
            this.model = new splat.User();
	    }
        var change = {};
        // Apply change to the model;
        // change is triggered once for each changed field-value
        var field = event.target.name;
        //get the input box value
        var value = event.target.value;
        change[field] = (value);
        // reflect changes in the model
        //run the validation check for the field and value in this Movie model
        var validation = this.model.validateField(field,value);
        //if the validation fail, we highlight the box and show the error message
        if(!validation.isValid){
            splat.utils.addValidationError(field, validation.message);
        }else{
            splat.utils.removeValidationError(field);
            //if the attribute is either genre or starring, we split the
            //value into array,
            //add the value into corresponding field of the model
            this.model.set(change);
        }
    },

    signin: function(e) {
        e.preventDefault();
	var self = this;
        var checku = self.model.validateField('username');
        checku.isValid ?
              splat.utils.removeValidationError('username')
            : splat.utils.addValidationError('username', checku.message);
        var checkp = self.model.validateField('password');
        checkp.isValid ?
              splat.utils.removeValidationError('password')
            : splat.utils.addValidationError('password', checkp.message);

	if (! (checku.isValid && checkp.isValid)) {
	    return false;
	}
	this.model.set({login: 1});
	this.model.save(null, {
	    type: 'put',
            wait: true,
            success: function(model, response) {
		if (response.error) {
                    splat.utils.showNotice('Signin Failed', 'danger',
                        response.error);
		} else {
		    //splat.token = response.token;
		    //splat.userid = response.userid;
		    //splat.username = response.username;
                    splat.utils.showNotice('Signin Successful!', 'success' ,
                        'Welcome back ' + splat.username);
		    Backbone.trigger('signedIn', response);
		}
            },
            error: function (model, err) {
                splat.utils.showNotice('Error ', 'danger' , err.responseText);
            }
	});
    },

    signout: function(e){
	e.preventDefault();
	$('#logoutdrop').removeClass('open');
	this.model.set({login: 0, username:"", password:""});
	this.model.save(null, {
	    type: 'put',
	    success: function(model, response) {
                splat.token = response.token;
		splat.utils.showNotice('Signout Successful!', 'success',
            'Please Come Back Soon');
		Backbone.trigger('signedOut', response);
	    },
            error: function (err) {
                splat.utils.showNotice('Error', 'danger', err.responseText);
            }
        });
    },


});
