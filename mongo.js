const mongoose = require('mongoose')

if(process.argv.length<3 ){
    console.log('Please provide the password as an argument')
    process.exit(1)
}

const url = `mongodb+srv://fullstack:${process.argv[2]}@cluster0.k3bva.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name : String,
    number : String
})

const PhoneRecord = mongoose.model('PhoneRecord',phoneSchema)

if(process.argv.length===3){
    console.log('Phonebook:')
    PhoneRecord.find({}).then(result => {
        result.forEach(record => {
            console.log(record.name,record.number)
        })
        mongoose.connection.close()
    })

}

if(process.argv.length===5){
    const newRecord = new PhoneRecord({
        name : process.argv[3],
        number : process.argv[4]
    })
    newRecord.save().then(result => {
        console.log(`added ${result.name} ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}