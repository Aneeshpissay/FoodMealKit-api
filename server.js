const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 4000,
    User = require('./models/userModel'),
    jsonwebtoken = require("jsonwebtoken"),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    cors = require('cors');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log("Database connected successfully")
}, (err) => {
    console.log(err);
});

app.use(cors());
app.options('*', cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      });
    } else {
      req.user = undefined;
      next();
    }
});
var routes = require('./route/userRoute');
routes(app);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})