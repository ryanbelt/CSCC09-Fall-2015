

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Header = Backbone.View.extend({

    initialize: function () {
        // update navbar in response to authentication events
        this.listenTo(Backbone, 'signedUp', this.signedUp);
        this.listenTo(Backbone, 'signedIn', this.signedIn);
        this.listenTo(Backbone, 'signedOut', this.signedOut);
    },
    // render the View
    render: function () {
	// set the view element ($el) HTML content using its template
	this.$el.html(this.template());

        var newuser = new splat.User();

        this.signupform = new splat.Signup({ model:newuser });
        this.$('#signupDiv').append(this.signupform.render().el);

        this.signinform = new splat.Signin({ model:newuser });
        this.$('#signinDiv').append(this.signinform.render().el);

	return this;    // support method chaining
    },

    authenticatedUI: function(response) {
        $('#greet').html(response.username);  // ugly!
        $('#signoutUser').html('<b>'+response.username+'</b>');
        $('.btn.signinSubmit').css("display","none");
        $('.btn.signoutSubmit').css("display","block");
        $('#add-header').show();  // auth'd users can add movies
    },

    // update UI on successful signup authentication
    signedUp: function(response) {
        $('#signupdrop').removeClass('open');
        $('.signinput').css("display","none");
        $('#signupForm')[0].reset();   // clear signup form
        this.authenticatedUI(response);
    },

    // update UI on successful signin authentication
    signedIn: function(response) {
        $('#signindrop').removeClass('open');
        $('[class*="signin"]').css("display","none");
        $('#signinForm')[0].reset();   // clear signin form
        this.authenticatedUI(response);
    },

    // update UI on authentication signout
    signedOut: function(model) {
        $('#greet').html('Sign In');
        $('#signoutUser').html('');
        $('.btn.signoutSubmit').css("display","none");
        $('.btn.signinSubmit').css("display","block");
        $('[class*="signin"]').css("display","block");
        $('#signindrop').removeClass('open');
        $('#add-header').hide();  // non-auth'd users can't add movies
    },

    events:{
        'click input[type=radio]': 'sortHandler',
    },

    sortHandler: function(e){
        console.log(e.currentTarget.value);
        event.stopPropagation();
        splat.order = event.target.value;  // set app-level order field
        Backbone.trigger('orderevent', event);  // trigger event for other views
        $('#orderForm').removeClass('open');  // close the dropdown menu
    },
    //change nav bar section and highlight it
    selectMenuItem: function(menuItem){
      this.$("a").removeClass("active");
      this.$("#"+menuItem).addClass("active");
    }
});
