const express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const request = require('request').defaults({ encoding: null });
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

passport.use(new GoogleStrategy({
    clientID: snsconfig.google_clientId,
    clientSecret: snsconfig.google_clientSecret,
    callbackURL: "/api/snslogin/googlecallback"
    },
    function(accessToken, refreshToken, profile, done) {
        // 사용자의 정보는 profile에 들어있다.
        return done(null, profile);
    }
));

passport.use(new KakaoStrategy({
    clientID : snsconfig.kakao_clientId,
    clientSecret: snsconfig.kakao_clientSecret,
    callbackURL : "http://localhost/api/snslogin/kakaocallback"
    },
    function(accessToken, refreshToken, profile, done){
        return done(null, profile);
    }
));

passport.use(new NaverStrategy({
    clientID: snsconfig.naver_clientId,
    clientSecret: snsconfig.naver_clientSecret,
    callbackURL: "http://localhost/api/snslogin/navercallback"
},
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.use(new FacebookStrategy({
    clientID: snsconfig.facebook_clientId,
    clientSecret: snsconfig.facebook_clientSecret,
    callbackURL: "/api/snslogin/facebookcallback",
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender', 'name', "birthday"]
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
        console.log('passport.authenticate(google)실행');
        console.log(user);
        const imageName = "image/" + crypto.createHash('sha1').update(user.photos[0].value).digest("base64") + ".jpg"
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
                            s3.upload({'Bucket':'sumai-profile', 'Key': imageName, 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                if(err) {
                                    console.log(err);
                                }
                                console.log(data);
                            });
                        });
                        db.query("INSERT INTO summary.account_info (type, id, email, verified, name, image, connectDate) \
                            VALUES ('GOOGLE', '"+ user.id +"', '"+ user.emails[0].value +"', "+ user.emails[0].verified +", '"+ user.displayName +"', '"+ imageName +"', NOW())", (err, data) => {
                            if(!err) {
                                console.log("signup")
                                req.session.loginInfo = {
                                    type: "google",
                                    email: user.emails[0].value,
                                    name: user.displayName
                                };
                                return req.session.save(() => {
                                    console.log("login")
                                    res.send("<script>window.close();</script>")
                                })
                            } else {
                                console.log(err);
                                res.send(err);
                            }
                        });
                    } else {
                        const verifiedUpdate = account[0].verified === 0? ", verified = "+ user.emails[0].verified: ""
                        const imageUpdate = account[0].image === null? ", image = '"+ imageName +"'": ""
                        db.query("UPDATE summary.account_info SET type = 'GOOGLE', id = '"+ user.id +"', connectDate = NOW()"+ verifiedUpdate + imageUpdate +" WHERE email = '"+ account[0].email + "'", (err, data) => {
                            if (err) {
                                console.log(err);
                                res.send(err);
                            }
                        })
                        req.session.loginInfo = {
                            type: "google",
                            email: account[0].email,
                            name: account[0].name
                        };
                        return req.session.save(() => {
                            console.log("login")
                            res.send("<script>window.close();</script>")
                        })
                    }
                })
            } else {
                req.session.loginInfo = {
                    type: "google",
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>window.close();</script>")
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
        console.log('passport.authenticate(kakao)실행');
        console.log(user);
        const email = typeof user._json.kakao_account.email === "undefined"? null : "'"+user._json.kakao_account.email+"'"
        const verified = typeof user._json.kakao_account.email === "undefined"? 0 : user._json.kakao_account.is_email_valid && user._json.kakao_account.is_email_verified
        const gender = typeof user._json.kakao_account.gender === "undefined"? null : "'"+user._json.kakao_account.gender+"'"
        const birthday = typeof user._json.kakao_account.birthday === "undefined"? null : "'"+user._json.kakao_account.birthday+"'"
        const age_range = typeof user._json.kakao_account.age_range === "undefined"? null : "'"+user._json.kakao_account.age_range.replace(/[^0-9]/g,"")+"'"
        const imageName = typeof user._json.properties.profile_image === "undefined"? null : "'image/" + crypto.createHash('sha1').update(user._json.properties.profile_image).digest("base64") + ".jpg'"
        db.query("SELECT * FROM summary.account_info WHERE id = '"+ user.id + "'", (err, account) => {
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
                                request.get(user._json.properties.profile_image, (err, res, body) => {
                                    s3.upload({'Bucket':'sumai-profile', 'Key': imageName.substring(1, imageName.length-1), 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                        if(err) {
                                            console.log(err);
                                        }
                                        console.log(data);
                                    });
                                });
                            }
                            db.query("INSERT INTO summary.account_info (type, id, email, verified, name, gender, birth, ageRange, image, connectDate) \
                                VALUES ('KAKAO', '"+ user.id +"', "+ email +", "+ verified +", '"+ user.username +"', "+ gender +", "+ birthday +", "+ age_range +", "+ imageName +", NOW())", (err, data) => {
                                if(!err) {
                                    console.log("signup")
                                    req.session.loginInfo = {
                                        type: "kakao",
                                        email: email,
                                        name: user.username
                                    };
                                    return req.session.save(() => {
                                        console.log("login")
                                        res.send("<script>window.close();</script>")
                                    })
                                } else {
                                    console.log(err);
                                    res.send(err);
                                }
                            });
                        } else {
                            const verifiedUpdate = account[0].verified === 0? ", verified = "+ verified: ""
                            const genderUpdate = account[0].gender === null? ", gender = "+ gender: ""
                            const birthUpdate = account[0].birth === null? ", birth = "+ birthday: ""
                            const ageRangeUpdate = account[0].ageRange === null? ", ageRange = "+ age_range: ""
                            const imageUpdate = account[0].image === null? ", image = "+ imageName: ""
                            db.query("UPDATE summary.account_info SET type = 'KAKAO', id = '"+ user.id +"', connectDate = NOW()"+ verifiedUpdate + genderUpdate + birthUpdate + ageRangeUpdate + imageUpdate +" WHERE email = '"+ account[0].email + "'", (err, data) => {
                                if (err) {
                                    console.log(err);
                                    res.send(err);
                                }
                            })
                            req.session.loginInfo = {
                                type: "kakao",
                                email: account[0].email,
                                name: account[0].name
                            };
                            return req.session.save(() => {
                                console.log("login")
                                res.send("<script>window.close();</script>")
                            })
                        }
                    })
                } else {
                    if(imageName !== null) {
                        request.get(user._json.properties.profile_image, (err, res, body) => {
                            s3.upload({'Bucket':'sumai-profile', 'Key': imageName.substring(1, imageName.length-1), 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                if(err) {
                                    console.log(err);
                                }
                                console.log(data);
                            });
                        });
                    }
                    db.query("INSERT INTO summary.account_info (type, id, email, verified, name, gender, birth, ageRange, image, connectDate) \
                        VALUES ('KAKAO', '"+ user.id +"', "+ email +", "+ verified +", '"+ user.username +"', "+ gender +", "+ birthday +", "+ age_range +", "+ imageName +", NOW())", (err, data) => {
                        if(!err) {
                            console.log("signup")
                            req.session.loginInfo = {
                                type: "kakao",
                                email: email,
                                name: user.username
                            };
                            return req.session.save(() => {
                                console.log("login")
                                res.send("<script>window.close();</script>")
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
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>window.close();</script>")
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
        console.log('passport.authenticate(naver)실행');
        console.log(user);
        db.query("SELECT * FROM summary.account_info WHERE id = '"+ user.id + "'", (err, account) => {
            const birthday = typeof user._json.birthday === "undefined"? null : "'"+user._json.birthday.replace(/[^0-9]/g,"")+"'"
            const age = typeof user._json.age === "undefined"? null : "'"+user._json.age.replace(/[^0-9]/g,"")+"'"
            const imageName = typeof user._json.profile_image === "undefined"? null : "'image/" + crypto.createHash('sha1').update(user._json.profile_image).digest("base64") + ".jpg'"
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
                                s3.upload({'Bucket':'sumai-profile', 'Key': imageName.substring(1, imageName.length-1), 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                    if(err) {
                                        console.log(err);
                                    }
                                    console.log(data);
                                });
                            });
                        }
                        db.query("INSERT INTO summary.account_info (type, id, email, name, birth, ageRange, image, connectDate) \
                            VALUES ('NAVER', '"+ user.id +"', '"+ user.emails[0].value +"', '"+ user.displayName +"', "+ birthday +", "+ age +", "+ imageName +", NOW())", (err, data) => {
                            if(!err) {
                                console.log("signup")
                                req.session.loginInfo = {
                                    type: "naver",
                                    email: user.emails[0].value,
                                    name: user.displayName
                                };
                                return req.session.save(() => {
                                    console.log("login")
                                    res.send("<script>window.close();</script>")
                                })
                            } else {
                                console.log(err);
                                res.send(err);
                            }
                        });
                    } else {
                        const birthUpdate = account[0].birth === null? ", birth = "+ birthday: ""
                        const ageUpdate = account[0].ageRange === null? ", ageRange = "+ age: ""
                        const imageUpdate = account[0].image === null? ", image = "+ imageName: ""
                        db.query("UPDATE summary.account_info SET type = 'NAVER', id = '"+ user.id +"', connectDate = NOW()"+ birthUpdate + ageUpdate + imageUpdate +" WHERE email = '"+ account[0].email + "'", (err, data) => {
                            if (err) {
                                console.log(err);
                                res.send(err);
                            }
                        })
                        req.session.loginInfo = {
                            type: "naver",
                            email: account[0].email,
                            name: account[0].name
                        };
                        return req.session.save(() => {
                            console.log("login")
                            res.send("<script>window.close();</script>")
                        })
                    }
                })
            } else {
                req.session.loginInfo = {
                    type: "naver",
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>window.close();</script>")
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
        console.log('passport.authenticate(facebook)실행');
        console.log(user);
        const email = typeof user.emails === "undefined"? null : "'"+user.emails[0].value+"'"
        const gender = typeof user.gender === "undefined"? null : "'"+user.gender+"'"
        const imageName = "image/" + crypto.createHash('sha1').update(user.photos[0].value).digest("base64") + ".jpg"
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
                                s3.upload({'Bucket':'sumai-profile', 'Key': imageName, 'ACL' : 'public-read', 'Body': body, 'ContentType':'image/jpg'}, (err, data) => {
                                    if(err) {
                                        console.log(err);
                                    }
                                    console.log(data);
                                });
                            });
                            db.query("INSERT INTO summary.account_info (type, id, email, name, gender, image, connectDate) \
                                VALUES ('FACEBOOK', '"+ user.id +"', "+ email +", '"+ user.displayName +"', "+ gender +", '"+ imageName +"', NOW())", (err, data) => {
                                if(!err) {
                                    console.log("signup")
                                    req.session.loginInfo = {
                                        type: "facebook",
                                        email: email,
                                        name: user.displayName
                                    };
                                    return req.session.save(() => {
                                        console.log("login")
                                        res.send("<script>window.close();</script>")
                                    })
                                } else {
                                    console.log(err);
                                    res.send(err);
                                }
                            });
                        } else {
                            const genderUpdate = account[0].gender === null? ", gender = "+ gender: ""
                            const imageUpdate = account[0].image === null? ", image = '"+ imageName+"'": ""
                            db.query("UPDATE summary.account_info SET type = 'FACEBOOK', id = '"+ user.id +"', connectDate = NOW()"+ genderUpdate + imageUpdate + " WHERE email = '"+ account[0].email + "'", (err, data) => {
                                if (err) {
                                    console.log(err);
                                    res.send(err);
                                }
                            })
                            req.session.loginInfo = {
                                type: "facebook",
                                email: account[0].email,
                                name: account[0].name
                            };
                            return req.session.save(() => {
                                console.log("login")
                                res.send("<script>window.close();</script>")
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
                    db.query("INSERT INTO summary.account_info (type, id, email, name, gender, image, connectDate) \
                        VALUES ('FACEBOOK', '"+ user.id +"', "+ email +", '"+ user.displayName +"', "+ gender +", '"+ imageName +"', NOW())", (err, data) => {
                        if(!err) {
                            console.log("signup")
                            req.session.loginInfo = {
                                type: "facebook",
                                email: email,
                                name: user.displayName
                            };
                            return req.session.save(() => {
                                console.log("login")
                                res.send("<script>window.close();</script>")
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
                    email: account[0].email,
                    name: account[0].name
                };
                return req.session.save(() => {
                    console.log("login")
                    res.send("<script>window.close();</script>")
                })
            }
        });
    })(req, res)
});

router.get('/confirm', (req, res) => {
    return new Promise(async (resolve, reject) => {
        const Interval = setInterval(() => {
            req.session.reload((err) => {
                if(typeof req.session.loginInfo !== "undefined"){
                    console.log(req.session.loginInfo);
                    resolve(res.send(req.session.loginInfo));
                    clearInterval(Interval)
                }
            })
        }, 500);
    })
})

module.exports = router;