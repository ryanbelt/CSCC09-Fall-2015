splat.Movies = Backbone.Collection.extend({
    // identify collectionâ€™s model
    model: splat.Movie,

    // save movie models in localStorage under "splat" namespace
    localStorage: new Backbone.LocalStorage('splat')
});