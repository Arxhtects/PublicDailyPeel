var express = require('express');
const cryptoRandomString = require('crypto');
var router = express.Router();

const title = require('./titles');
const functions = require('./functions');

/* GET users listing. */
router.get('/create', function(req, res, next) {
	let getCryptographicstring = cryptoRandomString.randomBytes(64).toString('base64');
	if (req.session.loggedin) {
		let getUser;
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
		req.session.postmetaid = "ban_" + getCryptographicstring + getStringForItems();
		req.session.save();
		typeof functions.callLoginMetaData(req, "check", "", function(result) {
			console.log(result);
			if(result == "true") {
				res.render('posts/create', { title: title.dashboardHome, getDate: functions.getDate, username: getUser, isbeingedited: "true"});
			} else {
				res.redirect('/logout');
			}
		}); 
	} else {
		res.redirect('/login');
	}
});

router.get('/edit', function(req, res, next) {
	if (req.session.loggedin) {
		let getUser;
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
		typeof functions.callLoginMetaData(req, "check", "", function(result) {
			if(result == "true") {
				let slug = req.query.post;
				console.log(slug);
				typeof functions.callFindPosts(slug, "", "", function(getMetaData, getBodyData, resultIsValid) {
					if(resultIsValid == "true") {
						req.session.postmetaid = getMetaData[0].post_meta_id;
						req.session.save();
						res.render('posts/edit', { title: title.siteTitle + "editing: " + getMetaData[0].post_title, getDate: functions.getDate, postData: getMetaData, postBody: getBodyData[0][0].body.substring(1, getBodyData[0][0].body.length-1), username: getUser});
					} else {
						res.render('posts/edit', { title: title.dashboardHome, errormsg: "unable to find data unfortuantly", posts: "", getDate: functions.getDate, username: getUser, isbeingedited: "true", postData: "", postBody: ""});
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

router.get('/*', function(req, res, next) {
	let getUser;
	if (req.session.loggedin) {
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
	}
	let slug = req.originalUrl
	slug = slug.split('/posts/')[1];
	typeof functions.callFindPosts(slug, "", "", function(getMetaData, getBodyData, resultIsValid) {
		if(resultIsValid == "true") {
			let usingProfileimg = "false";
			let imgitem = getBodyData[1][0].gradientdefault;
			if(getBodyData[1][0].profileimageurl != null && getBodyData[1][0].profileimageurl != "" && getBodyData[1][0].profileimageurl != undefined ) {
				usingProfileimg = "true";
				imgitem = getBodyData[1][0].profileimageurl;
			}
			console.log(getBodyData[1]);
			res.render('posts/single', { title: title.siteTitle + getMetaData[0].post_title, usingProfile: usingProfileimg, userImg: imgitem, getPostedDate: getMetaData[0].date, getDate: functions.getDate, postData: getMetaData, postBody: getBodyData[0][0].body.substring(1, getBodyData[0][0].body.length-1), postSlug: getBodyData[1][0].account_slug , postNickname: getBodyData[1][0].nickname ,username: getUser});
		} else {
			res.redirect("/404")
		}
	});			
});

function getStringForItems() {
    var d = new Date();
    return d.getMonth() + "" + d.getFullYear() + "" + d.getDay() + "" + d.getHours() + "" + d.getSeconds() + "" + d.getMilliseconds();
}

module.exports = router;
