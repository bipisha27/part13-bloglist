require('dotenv').config()
const express = require('express')
const app = express()

const { sequelize } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const {errorHandler} = require('./util/middleware')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})