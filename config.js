var config = {
	port:41127,
	dbuser:"herozadmin",
	dbpass:"herozpassword",
	dbname:"panjian2",
	//testing db
	//mongo ds045064.mongolab.com:45064/heroz -u a -p a
	db:"mongodb://a:a@ds045064.mongolab.com:45064/heroz",

	//local tester
	//db="127.0.0.1:27017/test";
}

/* example
config.twitter = {};
config.redis = {};
config.web = {};
 
config.default_stuff =  ['red','green','blue','apple','yellow','orange','politics'];
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';
config.redis.uri = process.env.DUOSTACK_DB_REDIS;
config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;
*/
 
module.exports = config;