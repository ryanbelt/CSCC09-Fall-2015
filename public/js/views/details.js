// declare splat-app namespace if it doesn't already exist
var splat =  splat || {};

// note View-name (Home) matches name of template file Home.html
splat.Details = Backbone.View.extend({
	events:{
    	  'click #moviesave': 'save',
    	  'click #moviedel': 'delete',
          'click #moviereview': 'review',
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

    review: function(){
    splat.app.navigate('#movies/'+this.model['id']+'/reviews' ,{trigger:true});
    },
    //function for save
    save: function(){
        event.preventDefault();
        var title=this.$("#title").val();
        var i = 0; //number of validation error variable
        //check all the input boxes validation
        i= this._allValidation();
        //if no validation error in boxes, then we save all the change
        if (i==0){
            //reset last edit date
            this.model.set("dated",(new Date).toISOString().substr(0,10));
            this.model.save ({},{wait:true,
                success: function(model,response){
                    //var mId = model.id;
                    //var temp= "movies/" + mId;
                    //console.log(temp);
                    //splat.app.navigate(temp, {replace:true, trigger:true});
                    splat.app.navigate('#movies', {replace:true, trigger:true});
                    splat.utils.showNotice('Success:','success',title+" has been saved");
                },
                error: function(model, response) {
                 // display the error response from the server
                //splat.utils.requestFailed(response);
                    console.error(response);
                splat.utils.showNotice('Failur:', "danger", "Something wrong with saving");
                }
            });
        }
        else{
            splat.utils.showNotice("Warning:","warning"," please fix your input(s) ");
        }
    },

    //function for delete
    delete: function(){
        var title=this.$("#title").val();  
        this.model.destroy ({
        wait: true,  // don't destroy client model until save-handlerver responds
        success: function(model, response) {
        // later, we'll navigate to the browse view upon success
            splat.app.navigate('#movies', {replace:true, trigger:true});
        // notification panel, defined in section 2.6
            splat.utils.showNotice('Success:', "success", title + ' has been deleted');
        },
        error: function(model, response) {
        // display the error response from the server
            splat.utils.showNotice('Failur:', "danger", "Something wrong with deletion");
            }
        });

    },

    //function to check validation when focus out the input box
    inputChange: function(event){
        //get the input box id(attribute in model)
        var field = event.target.id;
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
            //remove the validation highlight and error in the div
            splat.utils.removeValidationError(field);
            //if the attribute is either genre or starring, we split the 
            //value into array,
            if("genre"===field || "starring"===field){
                    var values = value.split(",");
                    changed[field]=values;
                }//otherwise just stay as what it is
                else{changed[field]=value;}
            //add the value into corresponding field of the model
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
        var reader=new FileReader();
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
        reader.onloadend = function() {
            var targetImgElt =  $('#poster')[0];
        // reader.result is image data in base64 format
            targetImgElt.src = reader.result;
            var newImg=self._resize(reader.result);
            console.log(newImg);
            self.model.set('poster',newImg);

            $('#detail-picture img').attr('src',newImg);

        };
        reader.readAsDataURL(pictureFile); // read image file
    },

    //idk how to make this work
    _resize: function(sourceImg, type, quality) {
        var type = type || "image/jpeg"; // default MIME image type
        var quality = quality || "0.95"; // tradeoff quality vs size
        var image = new Image(), MAX_HEIGHT = 300, MAX_WIDTH = 450;
        image.src = sourceImg;
        image.height = MAX_HEIGHT; // ADD CODE to scale height
        image.width = MAX_WIDTH; // ADD CODE to scale height
        var canvas = document.createElement("canvas");
        canvas.width = image.width; // scale canvas to match image
        canvas.height = image.height;
        var ctx = canvas.getContext("2d"); // get 2D rendering context
        ctx.drawImage(image,0,0, image.width, image.height); // render
        return canvas.toDataURL(type, quality);
    },

    //checking all the input box in detail page validation
    //return number of total errors
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
