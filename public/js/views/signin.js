

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
            splat.utils.addValidationError("signin-"+field, validation.message);
        }else{
            splat.utils.removeValidationError("signin-"+field);
            //if the attribute is either genre or starring, we split the
            //value into array,
            //add the value into corresponding field of the model
            this.model.set(change);
        }
    },

    signin: function(e) {
        e.preventDefault();
        console.log("singin token:"+splat.csrftoken);
        var allInput = document.getElementsByClassName("signinput");
	var self = this;
        var checku = self.model.validateField('username',allInput[0].value);
        checku.isValid ?
              splat.utils.removeValidationError('signin-username')
            : splat.utils.addValidationError('signin-username', checku.message);
        var checkp = self.model.validateField('password',allInput[1].value);
        checkp.isValid ?
              splat.utils.removeValidationError('signin-password')
            : splat.utils.addValidationError('signin-password', checkp.message);

	if (! (checku.isValid && checkp.isValid)) {
	    return false;
	}
        if(allInput[2].checked){
            this.model.set({remember: 1,login: 1});
        }else{
            this.model.set({login: 1,remember: 0});
        }
        Backbone.ajax = function() {
            // Invoke $.ajaxSetup in the context of Backbone.$
            Backbone.$.ajaxSetup.call(Backbone.$, {beforeSend: function(jqXHR){
                jqXHR.setRequestHeader("X-CSRF-Token", splat.csrftoken);
            }});
            return Backbone.$.ajax.apply(Backbone.$, arguments);
        };
	this.model.save(null, {
	    type: 'put',
            wait: true,
            success: function(model, response) {
		if (response.error) {
                    splat.utils.showNotice('Signin Failed', 'danger',
                        response.error);
		} else {
		    splat.userid = response.userid;
		    splat.username = response.username;
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
        this.model.set({login: 0});
        Backbone.ajax = function() {
            // Invoke $.ajaxSetup in the context of Backbone.$
            Backbone.$.ajaxSetup.call(Backbone.$, {beforeSend: function(jqXHR){
                jqXHR.setRequestHeader("X-CSRF-Token", splat.csrftoken);
            }});
            return Backbone.$.ajax.apply(Backbone.$, arguments);
        };
	this.model.save(null, {
	    type: 'put',
	    success: function(model, response) {
		splat.utils.showNotice('Signout Successful!', 'success',
            'Please Come Back Soon');
		Backbone.trigger('signedOut', response);
	    },
            error: function (err) {
                splat.utils.showNotice('Error', 'danger', err.responseText);
            }
        });
        console.log("after singout token:"+splat.csrftoken);
    },
});
