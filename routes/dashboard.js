var express = require('express');
var router = express.Router();

const connection = require('./db');
const title = require('./titles');
const functions = require('./functions');

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.loggedin) {
		let getUser;
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
		typeof functions.callLoginMetaData(req, "check", "", function(result) {
			console.log(result);
			if(result == "true") {
				typeof functions.callFindPosts(getUser[7], "userAll", "all", function(results) {
					if(results != "false") {
						//console.log(results);
						res.render('dashboard/home', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, posts: results});
					} else {	
						res.render('dashboard/home', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, posts: ""});
					}
				});
			} else {
				res.redirect('/logout');
			}
		}); 
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
