const mongoose = require('mongoose')
const shortid = require('shortid');

module.exports = function (config) {
    const Schema = mongoose.Schema

    const LinkSchema = new Schema({
        _id: {
            type: String,
            unique: true,
            default: shortid.generate
        },
        created: {
            type: Date,
            default: Date.now
        },
        url: String,
        title: String,
        custom: String
    })

    LinkSchema.pre('save', function (next) {
        let link = this
        console.log(link)
        if (link.custom) {
            link._id = link.custom
        }

        return next()
    })
    const model = mongoose.model('Link', LinkSchema)

    model.schema
        .path('url')
        .required('You need to have a long URL')

    return model
}
