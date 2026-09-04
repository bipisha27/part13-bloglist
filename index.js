require('dotenv').config()

const express = require('express')
const app = express()

const {connectToDatabase} = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { errorHandler } = require('./util/middleware')
const authorsRouter = require('./controllers/authors')
const testingRouter = require('./controllers/testing')

if (process.env.NODE_ENV === 'test' || process.env.TESTING === 'true')
  app.use('/api', testingRouter)

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('pong')
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3001

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()