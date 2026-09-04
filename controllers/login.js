const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const {SECRET} = require('../util/config')
const {User, Session} = require('../models')
const {randomUUID} = require('crypto')

router.post('/', async(req, res, next) => {
  try {
    const body = req.body

    const user = await User.findOne({
      where: {
        username: body.username
      }
    })

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    if(!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    if(user.disabled) {
      return res.status(401).json({
        error: 'account disabled'
      })
    }

    const sessionId = randomUUID()

    await Session.create({
      id: sessionId,
      userId: user.id
    })

    const userForToken = {
      username: user.username,
      id: user.id,
      sessionId
    }

    const token = jwt.sign(userForToken, SECRET)

    res.status(200).send({
      token,
      username: user.username,
      name: user.name
    })
  } catch(error) {
    next(error)
  }
})

module.exports = router