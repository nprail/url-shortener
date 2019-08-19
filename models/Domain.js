const mongoose = require('mongoose')

module.exports = config => {
  const { Schema } = mongoose

  const DomainSchema = new Schema(
    {
      domain: {
        type: String,
        unique: true,
        required: true
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
    },
    { timestamps: true }
  )

  const model = mongoose.model('Domain', DomainSchema)

  return model
}
