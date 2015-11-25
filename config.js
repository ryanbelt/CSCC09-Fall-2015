var config = {
	port:41127,
	env:"development",
	videoPath:"/public/img/videos/",
	sessionKey: 'splat.sess',
	sessionSecret: 'login_secret',
	sessionTimeout: 1000*60*20,  // 2 minute session timeout
	//school db
	//db:"mongodb://herozadmin:herozpassword@10.15.2.164/panjian2",

	//testing db
	//mongo ds045064.mongolab.com:45064/heroz -u a -p a
	db:'mongodb://a:a@ds045064.mongolab.com:45064/heroz',

	//local tester
	//db="127.0.0.1:27017/test";
}


 
module.exports = config;