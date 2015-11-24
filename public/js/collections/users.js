/**
 * Created by ryan on 11/24/2015.
 */

'use strict';

var splat =  splat || {};  // our app's namespace

splat.Users = Backbone.Collection.extend({
    url: "/auth",
    // Reference to this collection's model.
    model: splat.User,

    // Save all of the Dish items under the `"Dishes-backbone"` namespace.
    //localStorage: new Backbone.LocalStorage('eatz')

});