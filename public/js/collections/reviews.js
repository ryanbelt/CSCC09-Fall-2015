splat.Reviews = Backbone.Collection.extend({
	url: "/movies/:id/reviews",
    // identify collectionâ€™s model
    model: splat.Review,

    // save movie models in localStorage under "splat" namespace

});