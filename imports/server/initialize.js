
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

const Q         = require('q');
const fs 				= require('fs');
const md5       = require('md5');
const mysql 		= require('mysql');
const wrap 			= require('mysql-wrap');
const request 	= require('request');
const config 		= require('$custom/config');

// const db 				= Mysql.connect(config.mysql);

console.log('meteor-config', config.arg);
console.log('meteor-mysql', config.mysql);

let pool = mysql.createPool({
    connectionLimit: 200,
    host: config.mysql.hostname,
    port: config.mysql.port,
    user: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.dbname,
    supportBigNumbers: true,
    timezone: '+7:00',
    dateStrings: true,
});
 
let db = wrap(pool);

db.query(`SELECT * FROM repository`, {}, function(err, result){
	console.log(err, result);
	callback(err, result);
});

// let repository = Meteor.wrapAsync(function(callback) {

// });





  // console.log('mysql', repository().length);
// 
// removeAllUser();
// getMysql({ '_table':'user', '_get.status':'ON'}).forEach(function (user) {
// 	user = user._get;
// 	let profile = {
// 		status: user.status == 'ON' ? true : false,
// 		user_id: user.user_id,
// 		email: null,
// 		fullname: user.name + (user.surname ? ' ' + user.surname:''),
// 		position: user.position,
// 		level: user.level,
// 		role: {
// 			name: user.role_name,
// 			description: user.role_description
// 		},
// 		attended: user.attended,
// 		quit: user.quit,
// 	}
// 	var getEmail = getOneMysql({ '_table':'user_email', '_get.primary':'YES', '_get.user_id': user.user_id });

// 	profile.email = getEmail._get.email;
// 	profile.gravatar = md5(getEmail._get.email);
// 	Accounts.createUser({
// 		username: user.username,
// 		email: getEmail._get.email,
// 		password: user.password,
// 		profile: profile
// 	});
// });





Meteor.startup(function () {


});

process.on("SIGTERM", function() {
  console.log("SIGTERM END");
  db.end();
	db.destroy();
});

process.on("SIGINT", function() {
  console.log("SIGINT END");
  db.end();
	db.destroy();
});