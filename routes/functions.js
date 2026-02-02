const connection = require('./db');

const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
const regexNum = /\d/;
const emailreg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const unsafeReg = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

module.exports = {
    createMetaId : function(base64var) {
        const now = new Date();

        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        
        let metaid = base64var + day + month + year + seconds + minutes + hours;

        return metaid;
    },
    escapeSpecialChars : function(str, callback) { 
        return callback(str.replace(/[.*+?^${}()|[\]\\']/g, '\\$&'));
    },
    getSessionDetails: function(req, callback) {
        let getUser = [];
		getUser[0] = req.session.username;
		getUser[1] = req.session.metaid; //TODO
		getUser[2] = req.session.hasprofileimage;
		getUser[3] = req.session.gradientdefault;
		getUser[4] = req.session.profileimageurl;
		getUser[5] = req.session.nickname;
        getUser[6] = req.session.loginHash;
        getUser[7] = req.session.slug;

        return callback(getUser);
    },
    getGradient: function(callback) {
        var deg = Math.floor(Math.random() *360);
        var gradient = "linear-gradient(" + deg + "deg, " + "#" + createHex() + ", " + "#" + createHex() +")";
        
        return callback(gradient);
    },
    getDate: function() {
        return new Date().getFullYear();
    }, 
    callBanExistsFunction: function(address, callback) {  
        connection.query(`SELECT * FROM accounts WHERE address = '${address}'`,  function(error, results, fields) {
            if (error) throw error;	
            if (results.length > 0) {
                return callback("true");
            } else {
                return callback("false");
            }
        });
    },
    callUserExistsFunction: function (name, callback) {      
        connection.query(`SELECT * FROM accounts WHERE username = '${name}'`,  function(error, results, fields) {
            if (error) throw error;	
            if (results.length > 0) {
                return callback("true");
            } else {
                return callback("false");
            }
        });
    },
    validatepass: function(getRepeatedPin, getPin, callback) {
        if(getRepeatedPin == getPin) {
            if(getPin.length > 10) {
                if(regex.test(getPin)) { 
                    if(regexNum.test(getPin)) {
                        return callback("true");
                    } else {
                        return callback("false");
                    }
                } else {
                    return callback("false");
                }
            } else {
                return callback("false");
            }
        } else {
            return callback("false");
        }
    },
    validateChecksum: function(address) {
        if (address.length === 64 && address.startsWith('ban_')) {
            const accountMap = "13456789abcdefghijkmnopqrstuwxyz";
            const accountLookup = {};

            for (let i = 0; i < 32; i++) {
                accountLookup[accountMap[i]] = this.uintToBitArray(i, 5);
            }

            const acropKey = address.substring(4, address.length - 8);
            const acropCheck = address.substring(address.length - 8);

            let numberL = [];
            for (let x = 0; x < acropKey.length; x++) {
                numberL = numberL.concat(accountLookup[acropKey[x]]);
            }
            numberL = numberL.slice(4); // reduce from 260 to 256 bit

            let checkL = [];
            for (let x = 0; x < acropCheck.length; x++) {
                if (!(acropCheck[x] in accountLookup)) {
                    return false;
                }
                checkL = checkL.concat(accountLookup[acropCheck[x]]);
            }
            checkL = this.byteswap(checkL); // reverse byte order to match hashing format
            
            const h = this.blake2b(numberL);
            return h === this.hex(checkL);
        } else {
            return false;
        }
    },
    callSaveFunction: function(setPostTitle, setPostCategoy, setpostThumb, postContent, postMetaId, userMetaId, userSlug, callback){
        if (unsafeReg.test(postContent)) {
            setMessagetopass = [ "errormsg", "Unsafe elements have been added", setPostTitle + " could not be updated as unsafe elements are present in your post. Please remove them." ]
            return callback(setMessagetopass)
        } else {      
            let setMessagetopass = [];
            let setPostSlug = setPostTitle.replace(/ /g, "-").toLowerCase();
            const defineCheckSlugExistsQuery = `SELECT * FROM posts WHERE post_slug REGEXP ?`;
            connection.query(defineCheckSlugExistsQuery, [`${setPostSlug}[0-9]+$`],  function(error, results, fields) {
                if (error) throw error;
                if (results.length < 0) {
                    let getUrlLength = results.length;
                    setPostSlug = setPostSlug + "-" + parent(getUrlLength) + 1;
                }
            });
            const defineCheckExistsQuery = `SELECT * FROM posts WHERE post_meta_id = '${postMetaId}' AND connected_user_meta = '${userMetaId}'`;
            connection.query(defineCheckExistsQuery,  function(error, results, fields) {
                if (error) throw error;	
                if (results.length > 0) {
                    console.log(results);
                    let setUpdateQuery  = [
                        `UPDATE posts SET post_title = '${setPostTitle}', post_category = '${setPostCategoy}', post_type = 'post', post_thumbnail = '${setpostThumb}' WHERE post_meta_id = '${postMetaId}' AND connected_user_meta = '${userMetaId}'`,
                        `UPDATE post_body SET body = '${JSON.stringify(postContent)}' WHERE post_meta_id = '${postMetaId}' AND connected_user_meta = '${userMetaId}'`
                    ];
                    connection.query(setUpdateQuery.join(';'),  function(error, results, fields) {
                        if (error) throw error;	
                        if (results.length > 0) {
					        setMessagetopass = [ "successmsg", "Yay! It worked, Phew.", setPostTitle + " has been succesfully updated." ]
                            return callback(setMessagetopass)
                        } else {
					        setMessagetopass = [ "errormsg", "Uh-Oh! That didnt work", setPostTitle + " has not been succesfully updated, Monkeys are confused too." ]
                            return callback(setMessagetopass)
                        }
                    });
                } else {                 
                    const now = new Date();

                    const day = now.getDate();
                    const month = now.getMonth() + 1;
                    const year = now.getFullYear();    
                    const setPublishDate =  day + "/" + month + "/" + year;
                    let setInserQuery  = [
                        `INSERT INTO posts (post_title, post_category, post_meta_id, post_type, connected_user_meta, id, post_thumbnail, post_slug, connected_account_slug, date) VALUES ('${setPostTitle}', '${setPostCategoy}', '${postMetaId}', 'post', '${userMetaId}', NULL, '${setpostThumb}', '${setPostSlug}', '${userSlug}', '${setPublishDate}')`,
                        `INSERT INTO post_body (id, post_meta_id, connected_user_meta, body) VALUES (NULL, '${postMetaId}', '${userMetaId}', '${JSON.stringify(postContent)}')`,
                    ];
                    connection.query(setInserQuery.join(';'),  function(error, results, fields) {
                        if (error) throw error;	
                        if (results.length > 0) {
                        } else {
					        setMessagetopass = [ "successmsg", "Yay! It worked, Phew.", setPostTitle + " has been succesfully published." ]
                            return callback(setMessagetopass);
                        }
                    });
                }
            });
        }
    },
    callFindPosts: function(slug, type, target, callback) {
        if(slug != "" && slug != "undefined" && slug != null && type != "userAll") {
            const getPostData = `SELECT * FROM posts WHERE post_slug = '${slug}'`;
            connection.query(getPostData,  function(error, results, fields) {
                if (error) throw error;	
                if (results.length > 0) {
                    let bodydata;
                    let metadata = results;
                    let getPostMetaId = results[0].post_meta_id;
                    let findUserNickname = results[0].connected_account_slug;
                    let setQuery  = [
                        `SELECT * FROM post_body WHERE post_meta_id = '${getPostMetaId}'`,
                        `SELECT account_slug, nickname, gradientdefault, profileimageurl FROM accounts_meta WHERE account_slug = '${findUserNickname}'`
                    ];
                    connection.query(setQuery.join(';'),  function(error, results, fields) {
                        if (error) throw error;	
                        if (results.length > 0) {
                            bodydata = results;
                            return callback(metadata, bodydata, "true");
                        } else {
                            bodydata = "empty";
                            return callback("error", "no post exists", "false");
                        } 
                    });
                } else {
                    return callback("error", "no post exists", "false");
                }
            });
        } else {
            if(slug != "" && slug != "undefined" && slug != null && type == "userAll") {
                if(target == "user") {
                    const setQuery  =`SELECT * FROM posts WHERE connected_account_slug = '${slug}'`;
                    connection.query(setQuery,  function(error, results, fields) {
                        if (error) throw error;	
                        return callback(results); 
                    });
                } else {
                    const setQuery = `SELECT * FROM posts`;
                    connection.query(setQuery,  function(error, results, fields) {
                        if (error) throw error;	
                        return callback(results); 
                    });
                }
            } else {
                return callback("error", "no post exists", "false");
            }
        }
    },
    callLoginMetaData: function(req, type, newhash, callback) {
        let getUsername = req.session.username;
        let getUserMetaId = req.session.metaid;
        let getLoginUserHash = req.session.loginHash;
        if(type == "change") {
            const defineUpdateQuery = `UPDATE accounts SET logedinhash = '${newhash}' WHERE metaid = '${getUserMetaId}' AND username = '${getUsername}'`;
            connection.query(defineUpdateQuery,  function(error, results, fields) {
                if (error) throw error;	
                return callback("true");
            });
        } else {
            const defineCheckQuery = `SELECT * FROM accounts WHERE metaid = '${getUserMetaId}' AND username = '${getUsername}' AND logedinhash = '${getLoginUserHash}'`;
            connection.query(defineCheckQuery,  function(error, results, fields) {
                if (error) throw error;	
                if (results.length == 1) {
                    return callback("true");
                } else {
                    return callback("false");
                } 
            });
        }
    },
    callGetUserDetails: function(param, callback) {
        const defineCheckQuery = `SELECT profileimageurl, gradientdefault, nickname, role, blurb FROM accounts_meta WHERE account_slug = '${param}'`;
        connection.query(defineCheckQuery,  function(error, results, fields) {
            if (error) throw error;	
            if (results.length == 1) {
                return callback(results, "true");
            } else {
                return callback("", "false");
            } 
        });
    }
};

function createHex() {
    var hexCode1 = "";
    var hexValues1 = "0123456789abcdef";
    for ( var i = 0; i < 6; i++ ) {
      hexCode1 += hexValues1.charAt(Math.floor(Math.random() * hexValues1.length));
    }
    return hexCode1;
}