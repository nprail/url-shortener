const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const hashPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    return hash
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = config => {
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  })

  UserSchema.pre('save', function (next) {
    const user = this

    if (user.isModified('password') || user.isNew) {
      hashPassword(user.password)
        .then(res => {
          user.password = res
          next()
        })
        .catch(err => {
          return next(err)
        })
    } else {
      return next()
    }
  })

  // Create method to compare password input to password saved in database
  UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) {
        return cb(err)
      }
      cb(null, isMatch)
    })
  }

  UserSchema.methods.generateJwt = function () {
    const payload = {
      _id: this._id,
      email: this.email
    }
    const opts = {
      expiresIn: '7d'
    }

    return jwt.sign(payload, config.jwtSecret, opts)
  }
  const model = mongoose.model('User', UserSchema)

  return model
}
