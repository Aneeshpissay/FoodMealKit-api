const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 4000,
    User = require('./models/userModel'),
    jwt = require("jsonwebtoken"),
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

var userRoute = require('./route/userRoute');
var vegetableRoute = require('./route/vegetableRoute');
var recipeRoute = require('./route/recipeRoute');

userRoute(app);
vegetableRoute(app);
recipeRoute(app);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})