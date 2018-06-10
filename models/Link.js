const mongoose = require('mongoose')
const shortid = require('shortid')

module.exports = config => {
  const Schema = mongoose.Schema

  const LinkSchema = new Schema({
    short: {
      type: String,
      unique: true,
      require: true,
      default: shortid.generate
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    },
    url: {
      type: String,
      required: true
    },
    title: String,
    custom: String
  })

  LinkSchema.pre('save', function (next) {
    const link = this
    if (link.custom) {
      link.short = link.custom
    }
    link.update = Date.now

    return next()
  })
  const model = mongoose.model('Link', LinkSchema)

  model.schema.path('url').required('You need to have a long URL')

  return model
}
