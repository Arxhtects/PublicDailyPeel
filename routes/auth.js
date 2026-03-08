var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");

const cryptoRandomString = require('crypto');
let getCryptographicstring = cryptoRandomString.randomBytes(64).toString('base64');

const connection = require('./db');
const functions = require('./functions');
const { setClientId, setClientSecret, setRoleArray } = require('./discordauth');

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


router.post('/ajax/checktitle', function(req, res) {
	let getPostTitle = req.body.postTitle;
	typeof functions.callCheckTitle(getPostTitle, function(result) {
		res.send(result);
	});
});

router.post('/ajax/checkcategory', function(req, res) {
	let getCategoryName = req.body.postCat;
	typeof functions.callCheckCatName(getCategoryName, function(result) {
		res.send(result);
	});
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

router.get('/discord', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.send("No code returned from Discord");
    }

	const discordAuth2Param = new URLSearchParams({
		client_id: setClientId, //TODO Make process.env
		client_secret: setClientSecret,
		grant_type: 'authorization_code',
		code,
		redirect_uri: 'http://localhost:3000/auth/discord'
	});

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: discordAuth2Param,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });


    const tokenData = await tokenResponse.json();
    console.log("Token Data:", tokenData);

    req.session.discordAccessToken = tokenData.access_token;

    res.redirect('/auth/discord/result');
});

router.get('/discord/result', async (req, res) => {
    const accessToken = req.session.discordAccessToken;

    if (!accessToken) {
        return res.send("No access token in session");
    }

    const guildId = '415935345075421194';

    const response = await fetch(
        `https://discord.com/api/users/@me/guilds/${guildId}/member`,
        {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        }
    );
	
    const data = await response.json();

	if(data != null) {
		const userRolesId = data.roles;

		const matchedRoles = setRoleArray.filter(role =>
			userRolesId.includes(role.id)
		);

		console.log(data);
		console.log(userRolesId);

		console.log(matchedRoles);

		const getMatchedRoles = JSON.stringify(matchedRoles);

		typeof functions.getSessionDetails(req, function(result) {
			getUser = result;
		});

		const updateRoles = `UPDATE accounts_meta SET jobs = '${getMatchedRoles}' WHERE metaid = '${getUser[1]}'`;
		
        connection.query(updateRoles,  function(error, results, fields) {
            if (error) throw error;	
			console.log(results.changedRows);
            if (results.changedRows == 1) {
                res.send("Success");
            } else {
                res.send("Failed");
            }
        });
	} else {
		res.send("No data retrived");
	}

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