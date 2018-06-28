const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const router = express.Router()

module.exports = config => {
  const User = mongoose.model('User')

  router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({
      email
    })

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Authentication failed. User not found.'
      })
    } else {
      // Check if password matches
      user.comparePassword(password, (err, isMatch) => {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          const payload = {
            _id: user._id,
            email: user.email
          }
          const opts = {
            expiresIn: '7d'
          }
          const token = jwt.sign(payload, config.jwtSecret, opts)

          return res.status(200).json({
            success: true,
            token: token
          })
        } else {
          res.status(401).send({
            success: false,
            message: 'Authentication failed. Incorrect username or password.'
          })
        }
      })
    }
  })

  router.post('/register', async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({
          success: false,
          message: 'Please enter email and password.'
        })
      } else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password
        })

        // Attempt to save the user
        const user = await newUser.save()
        return res.json({
          success: true,
          message: 'Successfully created new user.',
          user
        })
      }
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'That email address or username already exists.'
        })
      }
      return res.status(500).json(err)
    }
  })

  return router
}
