require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const PhoneRecord = require('./models/phoneRecord')

let persons = [
    {
        'id': 1,
        'name': 'Arto Hellas',
        'number': '040-123456'
    },
    {
        'id': 2,
        'name': 'Ada Lovelace',
        'number': '39-44-5323523'
    },
    {
        'id': 3,
        'name': 'Dan Abramov',
        'number': '12-43-234345'
    },
    {
        'id': 4,
        'name': 'Mary Poppendieck',
        'number': '39-23-6423122'
    }
]


app.use(express.json())

app.use(express.static('build'))

const cors = require('cors')

app.use(cors())

// eslint-disable-next-line no-unused-vars
morgan.token('type',function(req,res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))


app.get('/api/persons/', (request, response) => {
    PhoneRecord.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${date}</div>
    `)
})

app.get('/api/persons/:id',(req,res,next) => {

    PhoneRecord.findById(req.params.id)
        .then(result => {
            if (result) {
                res.json(result)
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons',(req,res,next) => {
    const body = req.body

    if(!(body.name && body.number)){
        return res.status(400).json({
            error: 'content-missing'
        })
    }

    if(persons.some(p => p.name === body.name)){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    // PhoneRecord.find({name:body.name}).then(result => {
    //     if(result.length!==0)
    //     return res.status(400).json({
    //         error: "name must be unique"
    //     })
    //     console.log(result)
    // })

    const newRecord = new PhoneRecord({
        name : body.name,
        number : body.number
    })
    newRecord.save().then(result => {
        res.json(result)
    })
        .catch(error => next(error))

})

app.put('/api/persons/:id',(req,res,next) => {
    const body = req.body
    const person={
        id : body.id,
        name : body.name,
        number  : body.number
    }
    if(!body.number){
        return res.status(400).json({
            error: 'content-missing'
        })
    }
    PhoneRecord.findByIdAndUpdate(req.params.id, person, { new: true,runValidators: true, context: 'query' })
        .then(updatedRecord => {
            res.json(updatedRecord)
        })
        .catch(error => next(error))
    return res.status(200).json(person)
})


app.delete('/api/persons/:id',(req,res,next) => {
    PhoneRecord.findByIdAndRemove(req.params.id)
        .then(result => {
            console.log(result)
            res.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)