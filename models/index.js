const Blog = require('./blog')
const User = require('./user')

User.sync({alter: true})
Blog.sync({alter: true})

module.exports = {
  Blog, User
}