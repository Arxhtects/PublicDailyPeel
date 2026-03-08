var express = require('express');
var router = express.Router();

const connection = require('./db');
const title = require('./titles');
const functions = require('./functions');

/* GET users listing. */
router.get('/notifications', function(req, res, next) {
	if (req.session.loggedin) {
		let getUser;
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
		typeof functions.callLoginMetaData(req, "check", "", function(result) {
			console.log(result);
			if(result == "true") {
				res.render('users/notifications', { title: title.dashboardHome, getDate: functions.getDate, username: getUser});
			} else {
				res.redirect('/logout');
			}
		}); 
	} else {
		res.redirect('/login');
	}
});

router.get('/profile', function(req, res, next) {
	if (req.session.loggedin) {
		let getMetaId = req.session.metaid;
		let getUser;	
		let getProfileDetails = [];
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
		typeof functions.callLoginMetaData(req, "check", "", function(result) {
			console.log(result);
			if(result != "true") {
				res.redirect('/logout');
			}
		}); 
		connection.query(`SELECT role, blurb FROM accounts_meta WHERE metaid = '${getMetaId}'`,  function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				getProfileDetails[0] = results[0].role;
				getProfileDetails[1] = results[0].blurb;
				console.log(getUser[8]);
				res.render('users/profile', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, details: getProfileDetails});
			} else {
				res.render('users/profile', { title: title.dashboardHome,"errormsg" : "Unable to collect user data",  getDate: functions.getDate, username: getUser, details: getProfileDetails});
			}
		});
	} else {
		res.redirect('/login');
	}
});

router.get('/*', function(req, res, next) {
	let getUser;
	if (req.session.loggedin) {
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
	}
	let slug = req.originalUrl
	let collectjobroles;
	slug = slug.split('/users/')[1];
	typeof functions.callGetUserDetails(slug, function(results, resultIsValid) {
		let getUserData = results;
		if(resultIsValid == "true") {
			typeof functions.callFindPosts(slug, "userAll", "user", function(results) {
				if(results != "false") {
					const setJobRoles = getUserData[0].jobs;
					if (setJobRoles) {
						try {
							collectjobroles = JSON.parse(setJobRoles);
						} catch (e) {
							console.error("Invalid JSON in session.jobs:", e);
							collectjobroles = ""; 
						}
					} else {
						collectjobroles = ""; // Use single "=" for assignment
					}
					res.render('users/userpage', { title: title.siteTitle + "" + slug, getDate: functions.getDate, details: getUserData, jobs: collectjobroles, userPosts: results, username: getUser});
				} else {	
					res.redirect("/404")
				}
			});
		} else {
			res.redirect("/404")
		}
	});	
});

module.exports = router;
