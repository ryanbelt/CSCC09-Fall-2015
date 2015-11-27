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
        var self = this;
        //validation regex
        var emailRegex=/^\w+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;
        var stringRegex = /^[a-zA-Z0-9]+$/;

        this.validators.username = function (value) {
            return ((value && stringRegex.test(value))?
            {isValid: true} : {isValid: false, message: "You must enter a valid/ non-empty username"});
        };

        this.validators.email = function (value) {
            return ((emailRegex.test(value))?
            {isValid: true} : {isValid: false, message: "You must enter a non-empty email"});
        };

        this.validators.password = function (value) {
            return ((value && stringRegex.test(value))?
            {isValid: true} : {isValid: false, message: "You must enter a valid/non-empty password"});
        };

        this.validators.password2 = function (value) {
            return ((value && stringRegex.test(value))  ?
            {isValid: true} : {isValid: false, message: "Password values must match"});
        };

        this.validators.remember = function(value){
            return {isValid: true};
        }

    },

    validateField: function(field, value){
        return this.validators[field](value);
    },
});