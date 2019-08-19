const mongoose = require('mongoose')
const shortid = require('shortid')

module.exports = config => {
  const { Schema } = mongoose

  const LinkSchema = new Schema(
    {
      short: {
        type: String,
        unique: true,
        required: true,
        default: shortid.generate
      },
      url: {
        type: String,
        required: true
      },
      title: String,
      custom: String,
      domain: {
        type: Schema.Types.ObjectId,
        ref: 'Domain'
      }
    },
    { timestamps: true }
  )

  LinkSchema.pre('save', function (next) {
    const link = this
    if (link.custom) {
      link.short = link.custom
    }

    return next()
  })
  const model = mongoose.model('Link', LinkSchema)

  model.schema.path('url').required('You need to have a long URL')

  return model
}
