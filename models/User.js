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
  const { Schema } = mongoose

  const UserSchema = new Schema(
    {
      email: {
        type: String,
        unique: true,
        required: true
      },
      password: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  )

  UserSchema.pre('save', async function (next) {
    try {
      const user = this

      if (user.isModified('password') || user.isNew) {
        const pass = await hashPassword(user.password)
        user.password = pass
        next()
      }

      return next()
    } catch (err) {
      return next(err)
    }
  })

  // Create method to compare password input to password saved in database
  UserSchema.methods.comparePassword = async function (password, next) {
    try {
      const isMatch = await bcrypt.compare(password, this.password)

      next(null, isMatch)
    } catch (err) {
      return next(err)
    }
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
