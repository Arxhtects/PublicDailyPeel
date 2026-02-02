var express = require('express');
var router = express.Router();

const cryptoRandomString = require('crypto');
let getCryptographicstring = cryptoRandomString.randomBytes(64).toString('base64');

const bcrypt = require("bcryptjs");

const connection = require('./db');
const title = require('./titles');
const functions = require('./functions');

var async = require('async');

const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
const regexNum = /\d/;
const banRegex = /^ban_[13][13456789abcdefghijkmnopqrstuwxyz]{59}$/;

const submitToUrl = "https://www.daily-peel.com/api/validate_banano_message";
const setAuthmessage = `message-dailypeel-auth-${getCryptographicstring}`;

const signRequestLink = `https://thebananostand.com/signing?request=message_sign&address=ban_address_replacement_target&message=${encodeURIComponent(setAuthmessage)}&url=${encodeURIComponent(submitToUrl)}`;


/* GET home page. */
router.get('/', function(req, res, next) {
	let getUser;
	if (req.session.loggedin) {
		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});
		typeof functions.callLoginMetaData(req, "check", "", function(result) {
			if(result != "true") {
				res.redirect('/logout');
			} 
		}); 
	}
	typeof functions.callFindPosts("home", "userAll", "", function(results) {
		if(results != "false") {
			res.render('index', {title: title.homeTitle, date: functions.getDate, username: getUser, posts: results});
		} else {	
			res.redirect("/404")
		}
	});
});

router.get('/login', function(req, res, next) {
  	if (req.session.loggedin) {
		typeof functions.callLoginMetaData(req, "check", "", function(result) {
			console.log(result);
			if(result == "true") {
				res.redirect('/dashboard');
			} else {
				res.redirect('/logout');
			}
		}); 
  	} else {
    	res.render('auth/login', { title: title.loginTitle, date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
 	}
});

router.post('/login', function(req, res) {
	let getUser = req.body.user;
  	let getPin = req.body.pin;
	if (getUser && getPin) {
		connection.query(`SELECT password, hasprofileimage, metaid FROM accounts WHERE username = '${getUser}'`,  function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				let gethash = results[0].password;
				let getMetaId = results[0].metaid;
				bcrypt.compare(getPin, gethash)
				.then(hash => {
					if(hash == true) {
						var sessionTimeout = 86400;
						req.session.loggedin = true;
						req.session.loggedin.expires = new Date(Date.now() + sessionTimeout);
						req.session.username = getUser;
						req.session.hasprofileimage = results[0].hasprofileimage;
						req.session.metaid = results[0].metaid;
						connection.query(`SELECT profileimageurl, gradientdefault, nickname, account_slug FROM accounts_meta WHERE metaid = '${getMetaId}'`,  function(error, results, fields) {
							if (error) throw error;
							if (results.length > 0) {
								let newhash = getCryptographicstring;
								req.session.loginHash = newhash;
								req.session.gradientdefault = results[0].gradientdefault;
								req.session.profileimageurl = results[0].profileimageurl;
								req.session.nickname = results[0].nickname;
								req.session.slug = results[0].account_slug;
								typeof functions.callLoginMetaData(req, "change", newhash, function(result) {
									console.log(result);
									if(result == "true") {
										res.redirect('/dashboard');
									} else {
										res.redirect('/logout');
									}
								}); 
							}
						})
					} else {
						res.render('auth/login', {"title" : title.loginTitle, "errormsg" : "Incorrect Password", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
					}
				})
				.catch(err =>  {
					res.render('auth/login', {"title" : title.loginTitle, "errormsg" : err.message, date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
				}); 
			} else {
        		res.render('auth/login', {"title" : title.loginTitle, "errormsg" : "Username Doesn't exist", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
			}
		});
	} else {
		//legacy browser support
		res.render('auth/login', {"title" : title.loginTitle, "errormsg" : "Please enter Username and Password!", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
  	}
});

router.get('/sign-up', function(req, res, next) {
  if (req.session.loggedin) {
	typeof functions.callLoginMetaData(req, "check", "", function(result) {
		console.log(result);
		if(result == "true") {
			res.redirect('/dashboard');
		} else {
			res.redirect('/logout');
		}
	}); 
  } else {
    res.render('auth/sign-up', { title: title.registerTitle, date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
  }
});

router.post('/sign-up', function(req, res, next) {
	let getUser = req.body.user;
  	let getPin = req.body.pin;
	let getRepeatedPin = req.body.pinRepeat;
	let getBanaddress = req.body.banaddress;
	if (getUser && getPin) {
		typeof functions.validatepass(getRepeatedPin, getPin, function(result) {
			if(result == "true") {
				if(!regex.test(getUser)) {
					typeof functions.callUserExistsFunction(getUser, function(result) {
						if(result == "false") {
							if(banRegex.test(getBanaddress)) {
								typeof functions.callBanExistsFunction(getBanaddress, function(result) {	
									if(result == "false") {//TODO swap
										let grdientGen;
										typeof functions.getGradient(function(result) {
											gradientGen = result;
										});
										bcrypt.hash(getPin, 8)
										.then(hash => {
											let metaid = functions.createMetaId(getCryptographicstring);
											let accountSlug = getUser.replace(/ /g, "-").toLowerCase();
											let blurb = "I\'m a passionate advocate for animal welfare, particularly primates. My fascination with these intelligent creatures began with childhood memories of mischievous monkeys swinging through trees and enjoying juicy bananas.";
											typeof functions.escapeSpecialChars(blurb, function(result) {
												blurb = result
											});		
											let setQuery  = [
												`INSERT INTO accounts (id, metaid, username, password, salt, address, isVarified, privalges, dateJoined, hasprofileimage, logedinhash) VALUES ('', '${metaid}', '${getUser}', '${hash}', '', '${getBanaddress}', 'false', '0', '', 'false', '')`,
												`INSERT INTO accounts_meta (id, metaid, profileimageurl, gradientdefault, nickname, role, blurb, account_slug) VALUES ('', '${metaid}', '', '${gradientGen}', '${getUser}', 'Blog Author', '${blurb}', '${accountSlug}')`
											];
											connection.query(setQuery.join(';'), function (error, results, fields) {
												if (error) {
													console.log(error);
													res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : "You cant create an account at this time.", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
												} else {
													res.render('auth/sign-up', {"title" : title.registerTitle, "successmsg" : "User created successfully.", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
												}
											});
										})
										.catch(err =>  {
											res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : err.message, date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
										});
									} else {
										res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : "Ban address already linked to account.", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
									}
								},);
							} else {
								res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : "Not a valid banano address.", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
							}
						} else {
							res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : "Username already exists.", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
						}
					},);
				} else {
					res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : "Invalid Characters Found In Username.", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
				}
			} else {
				res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : "Password didnt meet required standards", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
			}
		});
	} else {
			res.render('auth/sign-up', {"title" : title.registerTitle, "errormsg" : "Password or Username missing.", date: functions.getDate , authString: setAuthmessage, authUrl: signRequestLink });
	}
});

router.get('/logout', function(req, res) {
	req.session.destroy();
  	res.redirect('/login');
});

module.exports = router;