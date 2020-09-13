const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
    type: String,
    required: true
}

const FilmSchema = new Schema({
    name: requiredString,
    type: requiredString,
    uuid: requiredString,
    year: {
        type: String
    },
    rate: {
        Number   
    },
    length: {
        type: String
    },
    country: {
        type: String
    },
    link: {
        type: String
    },
    picture: {
        type: String
    },
    cinemas: {
        type: [String],
        default: []
    }
})

mongoose.model('films', FilmSchema)