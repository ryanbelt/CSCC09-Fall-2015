/**
 * Created by ryan on 11/24/2015.
 */
'use strict';

var splat =  splat || {};  // our app's namespace

splat.User = Backbone.Model.extend({
    // match localStorage use of _id
    // rather than id
    urlRoot: "/auth",
    idAttribute: "_id",


    defaults: {
        username: '', //user
        password:'',//password
        email:''

    },

    initialize: function () {
        this.validators={};

        //validation regex
        var emailRegex=/^\w+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;

        this.validators.username = function (value) {
            return value.length > 0 ? {isValid: true} :
            {isValid: false, message: "You must enter a non-empty username"};
        };

        this.validators.email = function (value) {
            return ((emailRegex.test(value))?
            {isValid: true} : {isValid: false, message: "You must enter a non-empty email"});
        };

        this.validators.password = function (value) {
            return value.length > 0 ? {isValid: true} :
            {isValid: false, message: "You must enter a non-empty password"};
        };

        this.validators.repassword = function (value) {
            return ((value.length > 0) && (value == self.model.get("password"))) ?
            {isValid: true} : {isValid: false, message: "Password values must match"};
        };

    },

    validateField: function(field, value){
        return this.validators[field](value);
    },
});