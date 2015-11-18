/**
 * Created by ryan on 11/3/2015.
 */
// catch simple errors

// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Reviewer = Backbone.View.extend({
    // render the View
    render: function () {
        // set the view element ($el) HTML content using its template
        this.$el.html(this.template());
        //this.$('#reviewer_score').html(this.scoreView.render().el);
        //this.$('#sub-view').html(this.thumbView.render().el);
        return this;            // support method chaining
    },

    initialize:function(){
        var self=this;
        this.model.set('movieId',this.id);
        this.movie=new splat.Movie({_id:this.id});
        this.movie.fetch({wait:true, success:function(m,response) {
            self.scoreView = new splat.ScoreView({model:m});
        }});
        this.thumbView = new splat.ReviewThumb({collection:this.collection});
        this.listenTo(this.movie, "sync", this.Scorerender);
        this.listenTo(this.collection, "sync", this.Thumbrender);
        //this.listenTo(this.review, "sync", this.render);
    },

    Scorerender: function () {
        // set the view element ($el) HTML content using its template
        this.$('#reviewer_score').html(this.scoreView.render().el);
    },

    Thumbrender: function () {
        // set the view element ($el) HTML content using its template
        this.$('#sub-view div').html('');
        this.$('#sub-view').html(this.thumbView.render().el);

    },

    events:{
        'click #reviewsave': 'save',
        'change' : "inputChange",
    },

    save:function(){
        var i = this._allValidation();
        var self=this;
        if (i==0){
            //reset last edit date
            this.model.save ({},
                {wait:true,
                success: function(){
                    //success save, update collection and movie model.
                    //reset input form
                    self.collection.fetch();
                    self.movie.fetch();
                    self._successReset();
                    //splat.app.navigate('#movies/'+self.id , {replace:true, trigger:true});
                    splat.utils.showNotice('Success:','success',"Review has been saved");
                },
                error: function(model, response) {
                    // display the error response from the server
                    //splat.utils.requestFailed(response);
                    splat.utils.showNotice('Failur:', "danger", response.responseText);
                }
            });
        }
        else{
            splat.utils.showNotice("Warning:","warning"," please fix your input(s) ");
        }
    },

    inputChange:function(){
        var field = event.target.id;
        if(field!="rotten" && field!='fresh') {
            //get the input box value
            var value = event.target.value;
            var changed = {};
            //run the validation check for the field and value in this Movie model
            var validation = this.model.validateField(field, value);
            //if the validation fail, we highlight the box and show the error message
            if (!validation.isValid) {
                splat.utils.addValidationError(field, validation.message);
            }
            else {
                //remove the validation highlight and error in the div
                splat.utils.removeValidationError(field);
                //if the attribute is either genre or starring, we split the
                //value into array,
                    changed[field] = value;
                //add the value into corresponding field of the model
                this.model.set(changed);
                splat.utils.showNotice("Note:", "info", " click save before leaving the page");
            }
        }
    },

    //reset form formula
    _successReset: function(){
        var allInput = document.getElementsByClassName("form-control");
        var length= allInput.length;
        for (var k=0; k<length;k++){
            var controlGroup = $("#"+allInput[k].id).parent().parent();
            //adding success of that section
            controlGroup.removeClass('has-error has-success has-warning');
            allInput[k].value="";
        }
        allInput = document.getElementsByClassName("option");
        length= allInput.length;
        var controlGroup = $("#fresh").parent().parent();
        //adding success of that section
        controlGroup.removeClass('has-error has-success has-warning');
        for (var k=0; k<length;k++){
            allInput[k].checked=false;
        }
        this.model=new splat.Review();
        this.model.set('movieId',this.id);
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
                changed[field]=value;
                splat.utils.removeValidationError(field);
                this.model.set(changed);
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
            this.model.set(changed);
        }
        return i;
    }

});