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
          'drop #detail-picture': 'dropHandler',
          'change #poster': 'selectImage',
          'dragover #detail-picture': 'dragoverHandler',
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

    // image upload done in save-handler, to avoid
    // multiple-upload cost if user reselects image
    selectImage: function(event) {
    // set object attribute for image uploader
    this.pictureFile = event.target.files[0];   
    // if the file type is image, read it
    if ( this.pictureFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        //console.log(this.pictureFile);
        this._imageRead(this.pictureFile,this.pictureFile.type);
    }else{// else display notification error
            splat.utils.showNotice("Warning:","warning"," unable to dertermine image file type.");
        }
    },

    dragoverHandler: function(event) {
        // don't let parent element catch event
        event.stopPropagation();
        // prevent default to enable drop event
        event.preventDefault();
        // jQuery event doesn’t have dataTransfer
        // field - so use originalEvent
        event.originalEvent.dataTransfer.dropEffect ='copy';
    },

    dropHandler: function (event) {
        event.stopPropagation(); 
        event.preventDefault();
        var ev = event.originalEvent;
        // set object attribute for use by uploadPicture
        this.pictureFile = ev.dataTransfer.files[0];
        // only process image files
        if ( this.pictureFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            // Read image file and display in img tag
            this._imageRead(this.pictureFile, this.pictureFile.type);
        }
        else{// else display notification error
            splat.utils.showNotice("Warning:","warning"," unable to dertermine file image type.");
        }
    },

    _imageRead: function(pictureFile, type) {
        var self = this;
        var reader = new FileReader();
        // callback for when read operation is finished
        reader.onload = function(event) {
            var targetImgElt =  $('#poster')[0];
        // reader.result is image data in base64 format
            targetImgElt.src = reader.result;
            self.model.set('poster', reader.result);
        };
        reader.readAsDataURL(pictureFile); // read image file
    },

    _resize: function(sourceImg, type, quality) {
        var type = type || "image/jpeg"; // default MIME image type
        var quality = quality || "0.95"; // tradeoff quality vs size
        var image = new Image(), MAX_HEIGHT = 300, MAX_WIDTH = 450;
        image.src = sourceImg;
        image.height = image.height // ADD CODE to scale height
        image.width = image.width // ADD CODE to scale height
        console.log(image);
        var canvas = document.createElement("canvas");
        canvas.width = image.width; // scale canvas to match image
        canvas.height = image.height;
        var ctx = canvas.getContext("2d"); // get 2D rendering context
        ctx.drawImage(image,0,0, image.width, image.height); // render
        console.log(ctx);
        return canvas.toDataURL(type, quality);
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
