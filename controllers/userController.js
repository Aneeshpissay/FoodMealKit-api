var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User');

var { main } = require('../nodemailer');
exports.register = (req, res) => {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    newUser.phoneotp = randomOTP;
    newUser.save(function(err, user) {
    if (err) {
      return res.json({
        message: err
      });
    } else {
      main(user.email, `Thank you for registering ${user.username}`, `<p>Please enter the otp token: ${user.phoneotp}</p>`);
      user.hash_password = undefined;
      return res.json({success: true});
    }
  });
}

exports.sign_in = async (req, res) => {
  try {
      const {email, password } = req.body;
      const user = await User.findOne({email});
      if(!user) return res.json({msg: 'User does not exist'});
      const isMatch = await bcrypt.compare(password, user.hash_password);
      if(!isMatch) return res.json({msg: 'Incorrect Password'});
      if(!user.auth) return res.json({msg: 'Please enter the OTP recieved in your mail'});
      const accessToken = jwt.sign({ email: user.email, username: user.username, _id: user._id }, 'RESTFULAPIs');
      res.cookie('token', accessToken, {
          httpOnly: true
      });
      res.json({accessToken});
  } catch (error) {
      return res.status(500).json({msg: error.message});
  }
};

exports.otpLogin = async ( req, res ) => {
  try {
    const { phoneotp, email } = req.body;
    const user = await User.findOne({email});
    if(user.phoneotp === phoneotp) {
      user.phoneotp = null;
      user.auth = true;
      user.save();
      main(user.email, `You have successfully registed`, `<p>Please enjoy the tasty recipes</p>`);
      res.json({success: true});
    }
    else if(user.auth) {
      res.json({msg: 'You have already verified the email address'});
    }
    else {
      res.json({msg: 'Please enter the correct OTP'});
    }
  } catch (error) {
    
  }
}

