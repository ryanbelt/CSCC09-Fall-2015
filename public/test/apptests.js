/**
 * Created by ryan on 11/29/2015.
 */
QUnit.jUnitReport = function(report) {
    console.log(report.xml);   // send XML output report to console
}

test('Check model initialization parameters and default values', function() {

    //create a new instance of a User model
    var user = new splat.User({username: "a", password: "a"});
    // test that model has parameter attributes
    equal(user.get("username"), "a", "User title set correctly");
    equal(user.get("password"), "a", "User director set correctly");

    // test that Movie model has correct default values upon instantiation
    var movie = new splat.Movie();
    equal(movie.get("poster"), "img/placeholder.png",
        "Movie default value set correctly");
});

test("Fires a custom event when the state changes.", function() {
    var changeModelCallback = this.spy();
    var movie = new splat.Movie();
    movie.bind( "change", changeModelCallback );
    movie.set( { "title": "Interstellar" } );
    ok( changeModelCallback.calledOnce,
        "A change event-callback was correctly triggered" );
});

test("Test movie model/collection add/save, and callback functions.", function(assert) {
    assert.expect(4);   // 4 assertions to be run
    var done1 = assert.async();
    var done2 = assert.async();

    var errorCallback = this.spy();
    var movie = new splat.Movie({"__v":0,"dated":"2015-10-21T20:44:27.403Z",
        "director":"Sean Penn","duration":109,"freshTotal":18,"freshVotes":27,
        "poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
        "rating":"R","released":"1999","synopsis":"great thriller",
        "title":"Zorba Games","trailer":"http://archive.org",
        "userid":"54635fe6a1342684065f6959", "genre":["action"],
        "starring":["Bruce Willis,Amy Winemouse"]});  // model
    var movies = new splat.Movies();  // collection
    // verify Movies-collection URL
    equal( movies.url, "/movies",
        "correct URL set for instantiated Movies collection" );
    // test "add" event callback when movie added to collection
    var addModelCallback = this.spy();
    movies.bind( "add", addModelCallback );
    movies.add(movie);
    ok( addModelCallback.called,
        "add callback triggered by movies collection add()" );
    // make sure user is logged out
    var user = new splat.User({username:"a", password:"a"});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.deepEqual( resp, {'userid': null, 'username':null}, "Signout returns empty response object" );
            done1();

        },error: function(model,resp){
            console.log(model);
            console.log(resp);
        }
    });
    auth.done(function() {
        movie.save(null, {
            error: function (model, error) {
                assert.equal( error.status, 403,
                    "Saving without authentication returns 403 status");
                done2();
            }
        });
    });
});

test("Test movie-delete triggers an error event if unauthenticated.", function(assert) {
    var done1 = assert.async();
    var done2 = assert.async();
    var movie = new splat.Movie();  // model
    var movies = new splat.Movies();  // collection
    movies.add(movie);
    movie.set({"_id": "557761f092e40db92c3ccdae"});
    // make sure user is logged out
    var user = new splat.User({username:"a", password:"a"});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.deepEqual( resp, {'userid': null, 'username':null}, "Signout returns empty response object" );
            done1();

        }
    });
    auth.done(function() {
        // try to destroy an existing movie
        movie.destroy({
            error: function (model, resp) {
                assert.equal( resp.status, 403,
                    "Deleting without authentication returns 403 status code" );
                done2();
            }
        });
    });
});

test("Test movie create-delete succeeds in authenticated session.", function(assert) {
    assert.expect( 3 );
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    var movie = new splat.Movie({"__v":0,"dated":"2015-10-21T20:44:27.403Z",
        "director":"Sean Punn","duration":109,"freshTotal":18,"freshVotes":27,
        "poster":"img/uploads/5627f969b8236b2b7c0a37b6.jpeg?1448200894795",
        "rating":"R","released":"1999","synopsis":"great thriller",
        "title":"Zbrba Gomez","trailer":"http://archive.org",
        "genre":["action"],
        "starring":["Bruce Willis,Amy Winemouse"]});  // model
    movie.urlRoot = '/movies';
    // authenticate user with valid credentials
    var user = new splat.User({username:"a", password:"a", login: 1});
    var auth = user.save(null, {
        type: 'put',
        success: function (model, resp) {
            assert.equal( resp.username, "a",
                "Successful login with valid credentials" );
            done1();
        }
    });
    var saveMovie = $.Deferred();
    auth.done(function() {
        // create new movie model in DB
        movie.save(null, {
            wait: true,
            success: function (model, resp) {
                assert.notEqual( resp._id, undefined,
                    "Saving new model succeeds when authenticated" );
                saveMovie.resolve();
                done2();
            }
        });
    });
    // when authentication and saving async calls have completed
    $.when(auth, saveMovie).then(function() {
        // attempt to delete newly-saved movie
        movie.destroy({
            success: function (model, resp) {
                assert.equal( resp.responseText, "movie deleted",
                    "Deleting returns 200 status code" );
                done3();
            }
        });
    });
});