const bcrypt = require("bcryptjs")
const User = require("../models/users")
const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")

exports.signUp = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    res.status(400).send({
      status: false,
      message: "All fields are required"
    })
    return;
  }
  User.findOne({email})
  .then(user => {
    if (user) {
      return res.status(423)
      .send({status: false, message: `User with ${user.email} already exist`})
    }
    bcrypt
    .hash(password, 12)
    .then(password => {
      let user = new User({ email, password })
      return user.save()
    }).then(() => {
      res.status(201).send({status: true, message: "User registeration successful"})
    }).catch(err => { console.log(err); })
    res.json({message: "Welcome to my platform", email})
    return;  // return before calling next
    next()
  })
}

exports.logIn = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({email})
  .then(user => {
    if (!user) {
      return res.status(404).send({status: false, message: "Incorrect username or password, review details and try again"})
    }
    bcrypt.compare(password, user.password)
    .then(valid => {
      if(!valid) {
        res.status(403)
        .send({status: false, message: "Incorrect username or password, review details and try again"})
      }
      const token = jwt.sign(
        { email: user.email, _id: user._id},
        SECRET_KEY,
        { expiresIn: "1hr" }
      )
      res.status(200).send({
        status: true,
        message: "Login successful",
        _id: user._id,
        token
      })
    }).catch(err => console.log(err))
    return;
    next()
  })
}
