const express = require('express')
const morgan = require('morgan')
const res = require('express/lib/response')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

const cors = require('cors')
app.use(cors())

morgan.token('type',function(req,res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) =>{
    const date = new Date().toString()
    response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <div>${date}</div>
    `)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(!person){
        res.status(400).json({
            error: 'content missing'
        })
    }
    else{
        res.json(person)
    }
})

app.post('/api/persons',(req,res)=>{
    const body = req.body

    if(!(body.name && body.number)){
        return res.status(400).json({
            error: 'content-missing'
        })
    }

    if(persons.some(p => p.name === body.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    
    const id = Math.ceil(Math.random()*1000000)
    const person={
        id : id,
        name : body.name,
        number  : body.number
    }
    persons= persons.concat(person)

    
    return res.status(200).json(person)
    
})

app.put('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const body = req.body
    const person={
        id : id,
        name : body.name,
        number  : body.number
    }
    if(!body.number){
        return res.status(400).json({
            error: 'content-missing'
        })
    }
    const index = persons.findIndex(p=>p.id===id)
    persons[index]=person
    console.log(index,persons[index])
    persons = persons.map(p=>{
        if(p.id===id){
            return person
        }
        else return p
    })
    return res.status(200).json(person)
})


app.delete('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(p=>p.id !==id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, ()=> {
    
    console.log("Server running")
})