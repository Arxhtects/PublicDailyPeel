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
			//console.log(result);
			if(result == "true") {	
				const getTargetToDelete = req.query.delete;
				if(getTargetToDelete) {
					typeof functions.callDeletePosts(getUser[1], getTargetToDelete, function(results) {
						let setMessagetopass;
						if(results == false) { //erroed
							setMessagetopass = [ "errormsg", "Hu?! Something's not right!.", "Sorry there was an error trying to remove your post" ]
						} else {
							setMessagetopass = [ "successmsg", "Phew. That worked as intended.", "Your post has been sucessfully removed!" ]
						}
						typeof functions.callFindPosts(getUser[7], "userAll", "user", function(results) {
							if(results != "false") {
								//console.log(results);
								res.render('dashboard/home', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, posts: results, toastmsg: setMessagetopass});
							} else {	
								res.render('dashboard/home', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, posts: "", toastmsg: setMessagetopass});
							}
						});
					});
				} else {
					typeof functions.callFindPosts(getUser[7], "userAll", "user", function(results) {
						if(results != "false") {
							//console.log(results);
							res.render('dashboard/home', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, posts: results});
						} else {	
							res.render('dashboard/home', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, posts: ""});
						}
					});
				}
			} else {
				res.redirect('/logout');
			}
		}); 
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
