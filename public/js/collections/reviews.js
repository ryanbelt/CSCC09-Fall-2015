splat.Reviews = Backbone.Collection.extend({
	url: "/movies/:id", 
    // identify collectionâ€™s model
    model: splat.Review,

    // save movie models in localStorage under "splat" namespace
    localStorage: new Backbone.LocalStorage('splatReviews')

});