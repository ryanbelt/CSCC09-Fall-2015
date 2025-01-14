// catch simple errors
"use strict";

// declare splat-app namespace, if it doesn't already exist
var splat = splat || {};

splat.utils = {

    // Asynchronously load templates located in separate .html files using
    // jQuery "deferred" mechanism, an implementation of Promises.  Note we
    // depend on template file names matching corresponding View file names,
    // e.g. Home.html and home.js which defines Backbone View "Home".
    /*
     * @param {[String]} views:  filenames of templates to be loaded
     * @param {function} callback:  callback function invoked when file is loaded
     */
    loadTemplates: function(views, callback) {

	// Array of deferred actions to keep track of template load status
        var deferreds = [];

	// Process each template-file in views array
        /*
         * @param {[integer]} index:  position of view template within views array
         * @param {[String]} view:  root name (w/o .html) of view template file
         */
        $.each(views, function(index, view) {
	    // If an associated Backbone view is defined, set its template function
            if (splat[view]) {

		// Push task of retrieving template file into deferred array.
		// Task performs "get" request to load the template, then passes
		// resulting template data to anonymous function to process it.
	        /*
	         * @param {String} data:  HTML from template file as String
	         */
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
	    	    // Set template function on associated Backbone view.
                    splat[view].prototype.template = _.template(data);
                }));

	    // No Backbone view file is defined; cannot set template function.
            } else {
                console.log(view + " not found");
            }
        });

	// When all deferred template-loads have completed,
	// invoke callback function.
        $.when.apply(null, deferreds).done(callback);
    },
    
    showNotice: function(title,type, msg){
        //each time showing notice show cancel the notification if exist
        this.hideNotice();
        //1 sec to fade in
        $('.alert').fadeTo(1000,1);
        //notification bar and message
         $('.alert').removeClass("fade out alert-danger alert-warning alert-success alert-info");
         $('.alert').addClass("alert-" + type);
         $('.alert').html('<strong>'+ title + '</strong>' + msg);
        $('.alert').show();
        //4 sec to fade out
        $('.alert').fadeTo(5000,0);
    },

    hideNotice: function(){
        //always stop fading and hide it
        $('.alert').stop(true,true);
        $('.alert').hide();
    },

    flush: function(){
         $('.alert').stop(true);
    },

    addValidationError: function(field,msg){
        //go to the input field grand parent
        var controlGroup = $("#"+field).parent().parent();
        //adding error of that section
        controlGroup.removeClass('has-error has-success has-warning');
        controlGroup.addClass('has-error');
        controlGroup.find('.help-block').text(msg);
    },

    removeValidationError:function(field){
        //go to the input field grand parent
        var controlGroup = $("#"+field).parent().parent();
        //adding success of that section
        controlGroup.removeClass('has-error has-success has-warning');
        controlGroup.addClass('has-success');
        controlGroup.find('.help-block').text('');
    }
};
