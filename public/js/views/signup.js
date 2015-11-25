"use strict";

var splat =  splat || {};

splat.Signup = Backbone.View.extend({

    el: '<form id="signupForm" accept-charset="UTF-8">',

    events: {
        "change .signup" : "inputChange",
        "click .signupSubmit": "signup"
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    inputChange: function(event){
        //get the input box id(attribute in model)
        var field = event.target.name;
        //get the input box value
        var value = event.target.value;
        var changed={};
        //run the validation check for the field and value in this Movie model
        var validation = this.model.validateField(field,value);
        //if the validation fail, we highlight the box and show the error message
        if(!validation.isValid){
            splat.utils.addValidationError(field, validation.message);
        }
        else{
            if (event.target.name === 'password' || event.target.name === 'password2') {
                if (this.$('#password').val() !== this.$('#password2').val()) {
                    splat.utils.addValidationError(event.target.name, "Password values must match");
                } else {
                    //if the attribute is either genre or starring, we split the
                    //value into array,
                    changed[field]=value;
                    //add the value into corresponding field of the model
                    this.model.set(changed);
                    splat.utils.removeValidationError('password');
                    splat.utils.removeValidationError('password2');
                }
            } else {
                splat.utils.removeValidationError(field);
                //if the attribute is either genre or starring, we split the
                //value into array,
                changed[field]=value;
                //add the value into corresponding field of the model
                this.model.set(changed);
            }
        }
    },

    signup: function(event) {
        event.preventDefault();

        var i = 0; //number of validation error variable
        //check all the input boxes validation
        i= this._allValidation();
        if(i ==0){
            if (this.$('#password').val() !== this.$('#password2').val()) {
                console.log("bad pass=pass2");
                splat.utils.addValidationError("password", "Password values must match");
                splat.utils.addValidationError("password2", "Password values must match");
            } else {

                splat.utils.removeValidationError('password');
                splat.utils.removeValidationError('password2');
                this.model.save(null, {
                    wait: true,
                    success: function(model, response) {
                        if (response.error) {
                            splat.utils.showNotice('Signup Failed',
                                'Failed to create account', 'alert-danger');
                        } else {
                            //splat.token = response.token;
                            splat.userid = response.userid;
                            splat.username = response.username;
                            splat.utils.showNotice('Signup Successful!', 'success',
                                'Welcome ' + splat.username);
                            // header view updates when signedUp event fires
                            Backbone.trigger('signedUp', response);
                        }
                    },
                    error: function (model, err) {
                        splat.utils.showNotice('Error', 'danger', err.responseText);
                    }
                });
            }


        }else{
            splat.utils.showNotice("Warning:","warning"," please fix your input(s) ");
        }


    },

    _allValidation: function(){
        var i =0;
        var field = "";
        var value = "";
        var changed={};
        var allInput = document.getElementsByClassName("signup");
        var length= allInput.length;
        for (var k=0; k<length;k++){
            field = allInput[k].name;
            value = allInput[k].value;
            changed={};
            var validation = this.model.validateField(field,value);
            if(!validation.isValid){
                splat.utils.addValidationError(field, validation.message);
                i+=1;
            }
            else{
                changed[field]=value;
                splat.utils.removeValidationError(field);
                this.model.set(changed);
            }
        }
        return i;
    }

});
