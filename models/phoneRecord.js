const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to',url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB',result)
    })
    .catch((error) => {
        console.log('error connecting to MongoDB',error.message)
    })

const numberValidator = (s) => /\d{2,3}-\d{6,}/.test(s)
const phoneSchema = new mongoose.Schema({
    name : {
        type: String,
        minlength : 3,
        required: true
    },
    number : {
        type: String,
        minlength : 8,
        validate: [numberValidator , 'Number should be of correct format'],
        required: true
    }
})



phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('PhoneRecord', phoneSchema)