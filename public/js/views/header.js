

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Header = Backbone.View.extend({

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
