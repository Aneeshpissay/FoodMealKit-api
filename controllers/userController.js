var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  User = mongoose.model('User');

exports.register = (req, res) => {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function(err, user) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
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
      const accessToken = jwt.sign({ email: user.email, username: user.username, _id: user._id }, 'RESTFULAPIs');
      res.cookie('token', accessToken, {
          httpOnly: true
      });
      res.json({accessToken});
  } catch (error) {
      return res.status(500).json({msg: error.message});
  }
};

