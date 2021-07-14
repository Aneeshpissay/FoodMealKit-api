const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 4000,
    User = require('./models/userModel'),
    jwt = require("jsonwebtoken"),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    cors = require('cors');
require('dotenv').config();

var userRoute = require('./route/userRoute');
var recipeRoute = require('./route/recipeRoute');
var ordersRoute = require('./route/ordersRoute');

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
    console.log("Database connected successfully")
}, (err) => {
    console.log(err);
});

app.use(cors());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

userRoute(app);
recipeRoute(app);
ordersRoute(app);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})