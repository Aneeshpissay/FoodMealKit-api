const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var jwt = require('jsonwebtoken');

var getjwtToken = (user) => {
    return jwt.sign(user, 'RESTFULAPIs');
};

exports.userLogin = (req, res, next) => {
    User.findOne({phone: req.params.phone})
        .then((user) => {
            if(user) {
                client
                .verify
                .services(process.env.SERVICE_ID)
                .verificationChecks
                .create({
                    to: `+91${req.params.phone}`,
                    code: req.params.otp
                })
                .then((data) => {
                    if (data.valid) {
                        var token = getjwtToken({ _id: user._id });
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({token: token});
                    }
                    else {
                        let err = new Error("Wrong Otp")
                        next(err);
                    }
                })
                .catch((err) => next(err))
            }
            else {
                client
                .verify
                .services(process.env.SERVICE_ID)
                .verificationChecks
                .create({
                    to: `+91${req.params.phone}`,
                    code: req.params.otp
                })
                .then((data) => {
                    if (data.valid) {
                        User.create({
                            username: req.body.username,
                            phone: req.params.phone
                        })
                        .then((user)=>{
                            var token = getjwtToken({ phone: user.phone, username: user.username, _id: user._id });
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({token: token});
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    }
                    else {
                        let err = new Error("Wrong Otp")
                        next(err);
                    }
                })
                .catch((err) => next(err))
            }
        }, (err) => next(err))
        .catch((err) => next(err))
}

exports.userSignin = (req, res, next) => {
    client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
            to: `+91${req.body.phone}`,
            channel: 'sms'
        })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => next(err))
}