const express = require('express');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name
    })
    user.save().then(result => {
      res.status(201).json({
        message: 'User created',
        result: result
      });
    }).catch(error => {
      res.status(500).json({
        message: 'Invalid authentication credentials!'
      });
    })
  });

});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user){
      return res.status(404).json({
        message: 'Invalid authentication credentials!'
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      return res.status(404).json({
        message: 'Auth failed'
      })
    }
    const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret_key_for_development', { expiresIn: "1h" });
    res.status(200).json({
      message: 'Login success',
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  }).catch(error => {
    return res.status(404).json({
      message: 'Invalid authentication credentials!'
    })
  })
});

module.exports = router;
