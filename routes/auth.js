var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");

const cryptoRandomString = require('crypto');
let getCryptographicstring = cryptoRandomString.randomBytes(64).toString('base64');

const connection = require('./db');
const functions = require('./functions');

router.post('/ajax/passwordreset', function(req, res) {
	let getNewParam = req.body.newpass;
	let getCurrentParam = req.body.currentpass;
	let getUser;

	typeof functions.getSessionDetails(req, function(result) {
		getUser = result;
	});

	let getUsername = getUser[0];
	let getMetaId = getUser[1];
    let setMessagetopass = [];
	connection.query(`SELECT metaid FROM accounts WHERE username = '${getUsername}'`,  function(error, results, fields) {
		if (error) throw error;
		if (results.length > 0) {
			let checkMetaId = results[0].metaid;
			if(checkMetaId == getMetaId) {	
				if(getNewParam !== getCurrentParam) {
					bcrypt.hash(getNewParam, 8)
					.then(hash => { //UPDATE `accounts` SET `password` = 'test' WHERE `accounts`.`id` = 26;
						connection.query(`UPDATE accounts SET password = '${hash}' WHERE metaid = '${getMetaId}'`,  function(error, results, fields) {
							if (error) throw error;
							let newhash = getCryptographicstring;
							typeof functions.callLoginMetaData(req, "change", newhash, function(result) {
								console.log(result);
								if(result == "true") {
									setMessagetopass = [ "successmsg", "Yay! It worked, Phew.", "Your password has been updated." ]
									res.send(setMessagetopass);
								} else {
									setMessagetopass = [ "errormsg", "Hu?! Something's not right!.", "Sorry there was an error updating your hash, password was succesfully updated" ]
									res.send(setMessagetopass);
								}
							}); 
						});
					});
				} else {
					setMessagetopass = [ "errormsg", "Whoops! Something's wrong.", "Sorry Your New Password Is the same as your old one" ]
					res.send(setMessagetopass);
				}
			}
		} else {	
			setMessagetopass = [ "errormsg", "Whoops! Something's wrong.", "Unfortunatly That username doesnt exist in our ban-cords" ]	
			res.send(setMessagetopass);
		}
	});
});

router.post('/ajax/updateusermeta', function(req, res) {
	let getUser;
	let getData;
	typeof functions.callLoginMetaData(req, "check", "", function(result) {
		console.log(result);
		if(result != "true") {
			setMessagetopass = [ "errormsg", "Hu?! Something's not right!.", "Did you just change your password? Your hash doesnt look right" ];
			res.send(setMessagetopass);
		} else {

			typeof functions.getSessionDetails(req, function(result) {
				getUser = result;
			});
		
			typeof functions.escapeSpecialChars(req.body.data, function(result) {
				getData = result;
			});
		
			let getColumn = req.body.columnTarget;
		
			let getUsername = getUser[0];
			let getMetaId = getUser[1];
		
			let setMessagetopass = [];
			connection.query(`SELECT metaid FROM accounts WHERE username = '${getUsername}'`,  function(error, results, fields) {
				if (error) throw error;
				if (results.length > 0) {
					let checkMetaId = results[0].metaid;
					if(checkMetaId == getMetaId) {		
						connection.query(`UPDATE accounts_meta set ${getColumn} = '${getData}' WHERE metaid = '${getMetaId}'`,  function(error, results, fields) {
							if (error) throw error;
							if(getColumn == "nickname") {
								req.session.nickname = getData;
								req.session.save();
							}
							setMessagetopass = [ "successmsg", "Yay! It worked, Phew.", "Your nickname was successfully updated." ]
							res.send(setMessagetopass);
						});
					} else {	
						setMessagetopass = [ "errormsg", "Whoops! Something's wrong.", "Your Nickname couldn't be updated sorry." ]
						res.send(setMessagetopass);
					}
				}
			})
		}
	}); 
});

router.post('/ajax/setup', function(req, res) {

});

router.post('/ajax/publish', function(req, res) {
	let setPostTitle = req.body.postTitle;
	let setPostCategoy = req.body.postCat;
	let setpostThumb = req.body.postThumb;
	let postContent = req.body.content;
	let postMetaId = req.session.postmetaid;
	let userPostMetaId =  req.session.metaid;
	let userSlug = req.session.slug;
	let setMessagetopass = [];
	typeof functions.callLoginMetaData(req, "check", "", function(result) {
		console.log(result);
		if(result == "true") {
			typeof functions.callSaveFunction(setPostTitle, setPostCategoy, setpostThumb, JSON.parse(postContent), postMetaId, userPostMetaId, userSlug, function(result) {
				setMessagetopass = [ "successmsg", "Awesome! All done.", "Good job! Your post got saved." ];
				res.send(setMessagetopass);
			});
		} else {
			setMessagetopass = [ "errormsg", "Hu?! Something's not right!.", "Did you just change your password? Your hash doesnt look right" ];
			res.send(setMessagetopass);
		}
	}); 
	
});

router.get('/auth', function(req, res) {
    res.send("0");
});

router.get('/ajax/*', function(req, res) {
	let getUrl = req.originalUrl
	let getParams = req.query.attr;
	getUrl = getUrl.split('/')[3].split('?')[0];
	if(getUrl == "checkBanAddressExists") {
		typeof functions.callBanExistsFunction(getParams, function(result) {
			res.send(result);
		});
	}
	if(getUrl == "checkUsernameExists") {
		typeof functions.callUserExistsFunction(getParams, function(result) {
			res.send(result);
		});
	}
});

module.exports = router;