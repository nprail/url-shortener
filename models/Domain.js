const mongoose = require('mongoose')

module.exports = config => {
  const Schema = mongoose.Schema

  const DomainSchema = new Schema({
    domain: {
      type: String,
      unique: true,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    settings: {
      notFoundRedirect: String,
      rootRedirect: String
    }
  })

  DomainSchema.pre('save', function (next) {
    const domain = this
    domain.updated = Date.now

    return next()
  })

  const model = mongoose.model('Domain', DomainSchema)

  return model
}
