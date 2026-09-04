const jwt = require('jsonwebtoken')
const {SECRET} = require('./config')
const {User, Session} = require('../models')

const tokenExtractor = async(req, res, next) => {
  const authorization = req.get('authorization')

  if(!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({
      error: 'token missing'
    })
  }

  try {
    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, SECRET)

    const session = await Session.findByPk(decodedToken.sessionId)

    if(!session) {
      return res.status(401).json({
        error: 'session expired'
      })
    }

    const user = await User.findByPk(decodedToken.id)

    if(!user || user.disabled) {
      return res.status(401).json({
        error: 'account disabled'
      })
    }

    req.decodedToken = decodedToken
    next()
  } catch(error) {
    return res.status(401).json({
      error: 'token invalid'
    })
  }
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({error: error.errors.map(e => e.message)})
  }

  next(error)
}

module.exports = {errorHandler, tokenExtractor}