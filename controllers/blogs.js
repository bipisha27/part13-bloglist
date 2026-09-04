const router = require('express').Router()
const {Blog, User} = require('../models')
const {Op} = require('sequelize')
const {tokenExtractor} = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if(req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.substring]: req.query.search
        }
      },
      {
        author: {
          [Op.substring]: req.query.search
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: {exclude: ['userId']},
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  })

  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (!blog) {
    return res.status(204).end()
  }

  if(blog.userId != req.decodedToken.id) {
    return res.status(403).json({
      error: 'only the creator can delete this blog'
    })
  }

  await blog.destroy()
  res.status(204).end()
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)

    if (blog) {
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router