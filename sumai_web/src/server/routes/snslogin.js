const express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const request = require('request').defaults({ encoding: null });
const sharp = require('sharp');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const dbconfig  = require('../security/database');
const snsconfig  = require('../security/snsconfig');
const s3config  = require('../security/s3config');

const db = mysql.createPool(dbconfig)
const router = express.Router();
const s3 = new AWS.S3(s3config);

const ActionLog = require('../function/ActionLog')

passport.use(new GoogleStrategy({ // sumai.co.kr@gmail.com
    clientID: snsconfig.google_clientId,
    clientSecret: snsconfig.google_clientSecret,
    callbackURL: "/api/snslogin/googlecallback"
    },
    function(accessToken, refreshToken, profile, done) {
        // 사용자의 정보는 profile에 들어있다.
        return done(null, profile);
    }
));

passport.use(new KakaoStrategy({ // uxucorp@daum.net
    clientID : snsconfig.kakao_clientId,
    clientSecret: snsconfig.kakao_clientSecret,
    callbackURL : "http://localhost/api/snslogin/kakaocallback"
    },
    function(accessToken, refreshToken, profile, done){
        return done(null, profile);
    }
));

passport.use(new NaverStrategy({ // uxuinc@naver.com
    clientID: snsconfig.naver_clientId,
    clientSecret: snsconfig.naver_clientSecret,
    callbackURL: "http://localhost/api/snslogin/navercallback"
},
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.use(new FacebookStrategy({ // uxucorp@gmail.com
    clientID: snsconfig.facebook_clientId,
    clientSecret: snsconfig.facebook_clientSecret,
    callbackURL: "/api/snslogin/facebookcallback",
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user); // user객체가 deserializeUser로 전달됨.
});
passport.deserializeUser((user, done) => {
    done(null, user); // 여기의 user가 req.user가 됨
});

router.get('/google',
    passport.authenticate('google', { scope: ['openid', 'email', 'profile'] })
);

router.get('/googlecallback', (req, res) => {
	passport.authenticate('google', (err, user) => {
        // console.log('passport.authenticate(google)실행');
        // console.log(user);
        if(!user) {
            return res.send("<script>var win = window.open('','_self');win.close();</script>")
        }
        const imageName = crypto.createHash('sha1').update(user.id+Date.now()).digest("base64") + ".jpg"
        db.query("SELECT * FROM summary.account_info WHERE id = '"+ user.id + "'", (err, account) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else if(account.length === 0){
                db.query("SELECT * FROM summary.account_info WHERE email = '"+ user.emails[0].value + "'", (err, account) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else if(account.length === 0) {
                        request.get(user.photos[0].value, (err, res, body) => {
                            sharp(body).resize(300).toBuffer().then( data => { 
                                s3.upload({'Bucket':'sumai-profile', 'Key': 'image/'+imageName, 'ACL' : 'public-read', 'Body': data, 'ContentType':'image/jpg'}, (err, data) => {
                                    if(err) {
                                        console.log(err);
                                    }
                                    console.log(data);
                                });
                            })
                        });
                        db.query("INSERT INTO summary.account_info (type, id, email, name, image) \
                            VALUES ('GOOGLE', '"+ user.id +"', '"+ user.emails[0].value +"', '"+ user.displayName +"', '"+ encodeURIComponent(imageName) +"')", (err, data) => {
                            if(!err) {
                                console.log("signup")
                                // google 회원 가입 로그
                                db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, name, image) \
                            VALUES (now(), 'signup', 'GOOGLE', '"+ user.id +"', '"+ user.emails[0].value +"', '"+ user.displayName +"', '"+ encodeURIComponent(imageName) +"')")
                                req.session.loginInfo = {
                                    type: "google",
                                    id: user.id,
                                    email: user.emails[0].value,
                                    name: user.displayName
                                };
                                return req.session.save(() => {
                                    console.log("login")
                                    res.send("<script>var win = window.open('','_self');win.close();</script>")
                                })
                            } else {
                                console.log(err);
                                res.send(err);
                            }
                        });
                    } else {
                        req.session.loginInfo = {
                            type: account[0].type || "NORMAL",
                            id: -1,
                        };
                        return req.session.save(() => {
                            console.log("failure")
                            res.send("<script>var win = window.open('','_self');win.close();</script>")
                        })
                    }
                })
            } else {
                req.session.loginInfo = {
                    type: "google",
                    id: user.id,
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>var win = window.open('','_self');win.close();</script>")
                })
            }
        });
    })(req, res)
})

router.get('/kakao',
    passport.authenticate('kakao')
);

router.get('/kakaocallback', (req, res) => {
    passport.authenticate('kakao', (err, user) => {
        // console.log('passport.authenticate(kakao)실행');
        // console.log(user);
        if(!user) {
            return res.send("<script>var win = window.open('','_self');win.close();</script>")
        }
        db.query("SELECT * FROM summary.account_info WHERE id = '"+ user.id + "'", (err, account) => {
            const email = typeof user._json.kakao_account.email === "undefined"? null : "'"+user._json.kakao_account.email+"'"
            const email_ = typeof user._json.kakao_account.email === "undefined"? null : user._json.kakao_account.email
            const gender = typeof user._json.kakao_account.gender === "undefined"? null : "'"+user._json.kakao_account.gender+"'"
            const age_range = typeof user._json.kakao_account.age_range === "undefined"? null : "'"+user._json.kakao_account.age_range.replace(/[^0-9]/g,"")+"'"
            const imageName = typeof user._json.properties.thumbnail_image === "undefined"? null : "image/" + crypto.createHash('sha1').update(String(user.id)+Date.now()).digest("base64") + ".jpg"
            const imageURI = typeof user._json.properties.thumbnail_image === "undefined"? null : "'"+encodeURIComponent(crypto.createHash('sha1').update(String(user.id)+Date.now()).digest("base64") + ".jpg")+"'"
            if (err) {
                console.log(err);
                res.send(err);
            } else if(account.length === 0){
                if (email !== null) {
                    db.query("SELECT * FROM summary.account_info WHERE email = "+ email , (err, account) => {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else if(account.length === 0) {
                            if(imageName !== null) {
                                request.get(user._json.properties.thumbnail_image, (err, res, body) => {
                                    s3.upload({'Bucket':'sumai-profile', 'Key': imageName, 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                        if(err) {
                                            console.log(err);
                                        }
                                        console.log(data);
                                    });
                                });
                            }
                            db.query("INSERT INTO summary.account_info (type, id, email, name, gender, ageRange, image) \
                                VALUES ('KAKAO', '"+ user.id +"', "+ email +", '"+ user.username +"', "+ gender +", "+ age_range +", "+ imageURI +")", (err, data) => {
                                if(!err) {
                                    // kakao 회원가입 로그
                                    db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, name, gender, ageRange, image) \
                                    VALUES (now(), 'signup', 'KAKAO', '"+ user.id +"', "+ email +", '"+ user.username +"', "+ gender +", "+ age_range +", "+ imageURI +")")
                                    console.log("signup")
                                    req.session.loginInfo = {
                                        type: "kakao",
                                        id: user.id,
                                        email: email_,
                                        name: user.username
                                    };
                                    return req.session.save(() => {
                                        console.log("login")
                                        res.send("<script>var win = window.open('','_self');win.close();</script>")
                                    })
                                } else {
                                    console.log(err);
                                    res.send(err);
                                }
                            });
                        } else {
                            req.session.loginInfo = {
                                type: account[0].type || "NORMAL",
                                id: -1,
                            };
                            return req.session.save(() => {
                                console.log("failure")
                                res.send("<script>var win = window.open('','_self');win.close();</script>")
                            })
                        }
                    })
                } else {
                    if(imageName !== null) {
                        request.get(user._json.properties.thumbnail_image, (err, res, body) => {
                            s3.upload({'Bucket':'sumai-profile', 'Key': imageName, 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                if(err) {
                                    console.log(err);
                                }
                                console.log(data);
                            });
                        });
                    }
                    db.query("INSERT INTO summary.account_info (type, id, email, name, gender, ageRange, image) \
                        VALUES ('KAKAO', '"+ user.id +"', "+ email +", '"+ user.username +"', "+ gender +", "+ age_range +", "+ imageURI +")", (err, data) => {
                        if(!err) {
                            console.log("signup")
                            // kakao 회원가입 로그
                            db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, name, gender, ageRange, image) \
                            VALUES (now(), 'signup', 'KAKAO', '"+ user.id +"', "+ email +", '"+ user.username +"', "+ gender +", "+ age_range +", "+ imageURI +")")
                            req.session.loginInfo = {
                                type: "kakao",
                                id: user.id,
                                email: user.id,
                                name: user.username
                            };
                            return req.session.save(() => {
                                console.log("login")
                                res.send("<script>var win = window.open('','_self');win.close();</script>")
                            })
                        } else {
                            console.log(err);
                            res.send(err);
                        }
                    });
                }
            } else {
                req.session.loginInfo = {
                    type: "kakao",
                    id: user.id,
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>var win = window.open('','_self');win.close();</script>")
                })
            }
        });
    })(req, res)
});

router.get('/naver',
    passport.authenticate('naver')
);

router.get('/navercallback', (req, res) => {
    passport.authenticate('naver', (err, user) => {
        // console.log('passport.authenticate(naver)실행');
        // console.log(user);
        if(!user) {
            return res.send("<script>var win = window.open('','_self');win.close();</script>")
        }
        db.query("SELECT * FROM summary.account_info WHERE id = '"+ user.id + "'", (err, account) => {
            const age = typeof user._json.age === "undefined"? null : "'"+user._json.age.replace(/[^0-9]/g,"")+"'"
            const imageName = typeof user._json.profile_image === "undefined"? null : "image/" + crypto.createHash('sha1').update(user.id+Date.now()).digest("base64") + ".jpg"
            const imageURI = typeof user._json.profile_image === "undefined"? null : "'"+encodeURIComponent(crypto.createHash('sha1').update(user.id+Date.now()).digest("base64") + ".jpg")+"'"
            if (err) {
                console.log(err);
                res.send(err);
            } else if(account.length === 0){
                db.query("SELECT * FROM summary.account_info WHERE email = '"+ user.emails[0].value + "'", (err, account) => {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else if(account.length === 0) {
                        if(imageName !== null) {
                            request.get(user._json.profile_image, (err, res, body) => {
                                sharp(body).resize(300).toBuffer().then( data => { 
                                    s3.upload({'Bucket':'sumai-profile', 'Key': imageName, 'ACL' : 'public-read', 'Body': data, 'ContentType':'image/jpg'}, (err, data) => {
                                        if(err) {
                                            console.log(err);
                                        }
                                        console.log(data);
                                    });
                                })
                            });
                        }
                        db.query("INSERT INTO summary.account_info (type, id, email, name, ageRange, image) \
                            VALUES ('NAVER', '"+ user.id +"', '"+ user.emails[0].value +"', '"+ user.displayName +"', "+ age +", "+ imageURI +")", (err, data) => {
                            if(!err) {
                                console.log("signup")
                                // naver 회원가입 로그
                                db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, name, ageRange, image) \
                                VALUES (now(), 'signup', 'NAVER', '"+ user.id +"', '"+ user.emails[0].value +"', '"+ user.displayName +"', "+ age +", "+ imageURI +")")
                                req.session.loginInfo = {
                                    type: "naver",
                                    id: user.id,
                                    email: user.emails[0].value,
                                    name: user.displayName
                                };
                                return req.session.save(() => {
                                    console.log("login")
                                    res.send("<script>var win = window.open('','_self');win.close();</script>")
                                })
                            } else {
                                console.log(err);
                                res.send(err);
                            }
                        });
                    } else {
                        req.session.loginInfo = {
                            type: account[0].type || "NORMAL",
                            id: -1,
                        };
                        return req.session.save(() => {
                            console.log("failure")
                            res.send("<script>var win = window.open('','_self');win.close();</script>")
                        })
                    }
                })
            } else {
                req.session.loginInfo = {
                    type: "naver",
                    id: user.id,
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>var win = window.open('','_self');win.close();</script>")
                })
            }
        });
    })(req, res)
});

router.get('/facebook',
    passport.authenticate('facebook', { display : 'popup', scope: ['public_profile', 'email'] })
);

router.get('/facebookcallback', (req, res) => {
    passport.authenticate('facebook', (err, user) => {
        // console.log('passport.authenticate(facebook)실행');
        // console.log(user);
        if(!user) {
            return res.send("<script>var win = window.open('','_self');win.close();</script>")
        }
        const email = typeof user.emails === "undefined"? null : "'"+user.emails[0].value+"'"
        const email_ = typeof user.emails === "undefined"? null : user.emails[0].value
        const gender = typeof user.gender === "undefined"? null : "'"+user.gender+"'"
        const imageName = crypto.createHash('sha1').update(user.id+Date.now()).digest("base64") + ".jpg"
        db.query("SELECT * FROM summary.account_info WHERE id = '"+ user.id + "'", (err, account) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else if(account.length === 0){
                if (email !== null) {
                    db.query("SELECT * FROM summary.account_info WHERE email = "+ email, (err, account) => {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else if(account.length === 0) {
                            request.get(user.photos[0].value, (err, res, body) => {
                                s3.upload({'Bucket':'sumai-profile', 'Key': "image/" + imageName, 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                    if(err) {
                                        console.log(err);
                                    }
                                    console.log(data);
                                });
                            });
                            db.query("INSERT INTO summary.account_info (type, id, email, name, gender, image) \
                                VALUES ('FACEBOOK', '"+ user.id +"', "+ email +", '"+ user.displayName +"', "+ gender +", '"+ encodeURIComponent(imageName) +"')", (err, data) => {
                                if(!err) {
                                    console.log("signup")
                                    // facebook 회원가입 로그
                                    db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, name, gender, image) \
                                    VALUES (now(), 'signup', 'FACEBOOK', '"+ user.id +"', "+ email +", '"+ user.displayName +"', "+ gender +", '"+ encodeURIComponent(imageName) +"')")
                                    req.session.loginInfo = {
                                        type: "facebook",
                                        id: user.id,
                                        email: email_,
                                        name: user.displayName
                                    };
                                    return req.session.save(() => {
                                        console.log("login")
                                        res.send("<script>var win = window.open('','_self');win.close();</script>")
                                    })
                                } else {
                                    console.log(err);
                                    res.send(err);
                                }
                            });
                        } else {
                            req.session.loginInfo = {
                                type: account[0].type || "NORMAL",
                                id: -1,
                            };
                            return req.session.save(() => {
                                console.log("failure")
                                res.send("<script>var win = window.open('','_self');win.close();</script>")
                            })
                        }
                    })
                } else {
                    request.get(user.photos[0].value, (err, res, body) => {
                        s3.upload({'Bucket':'sumai-profile', 'Key': imageName, 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                            if(err) {
                                console.log(err);
                            }
                            console.log(data);
                        });
                    });
                    db.query("INSERT INTO summary.account_info (type, id, email, name, gender, image) \
                        VALUES ('FACEBOOK', '"+ user.id +"', "+ email +", '"+ user.displayName +"', "+ gender +", '"+ encodeURIComponent(imageName) +"')", (err, data) => {
                        if(!err) {
                            console.log("signup")
                            // facebook 회원가입 로그
                            db.query("INSERT INTO summary.account_change (modifiedDate, changeData, type, id, email, name, gender, image) \
                            VALUES (now(), 'signup', 'FACEBOOK', '"+ user.id +"', "+ email +", '"+ user.displayName +"', "+ gender +", '"+ encodeURIComponent(imageName) +"')")
                            req.session.loginInfo = {
                                type: "facebook",
                                id: user.id,
                                email: user.id,
                                name: user.displayName
                            };
                            return req.session.save(() => {
                                console.log("login")
                                res.send("<script>var win = window.open('','_self');win.close();</script>")
                            })
                        } else {
                            console.log(err);
                            res.send(err);
                        }
                    });
                }
            } else {
                req.session.loginInfo = {
                    type: "facebook",
                    id: user.id,
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>var win = window.open('','_self');win.close();</script>")
                })
            }
        });
    })(req, res)
});

router.get('/confirm', (req, res) => {
    return new Promise(async (resolve, reject) => {
        req.session.reload((err) => {
            if(typeof req.session.loginInfo !== "undefined"){
                console.log(req.session.loginInfo);
                if(req.session.loginInfo.id === -1) {
                    const logintype = req.session.loginInfo.type
                    delete req.session.loginInfo;
                    req.session.save(() => {
                        resolve(res.status(400).send(logintype));
                    })
                } else {
                    ActionLog(req, `[S]sns login`)
                    resolve(res.send(req.session.loginInfo));
                }
            } else {
                resolve(res.status(499).send("cancel"))
            }
        })
    })
})

module.exports = router;