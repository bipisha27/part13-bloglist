const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if(!blogId || !userId) {
      return res.status(400).json({
        error: 'blogId and userId are required'
      })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        error: 'user not found'
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return res.status(404).json({
        error: 'blog not found'
      })
    }

    const existing = await ReadingList.findOne({
      where: {
        userId,
        blogId
      }
    })

    if (existing) {
      return res.status(400).json({
        error: 'blog is already in the reading list'
      })
    }

    const readingListEntry = await ReadingList.create({
      userId,
      blogId
    })

    res.status(201).json({
      id: readingListEntry.id,
      blog_id: readingListEntry.blogId,
      user_id: readingListEntry.userId,
      read: readingListEntry.read
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingListEntry = await ReadingList.findByPk(req.params.id)

    if (!readingListEntry) {
      return res.status(404).json({
        error: 'reading list entry not found'
      })
    }

    if (readingListEntry.userId !== req.decodedToken.id) {
      return res.status(401).json({
        error: 'only the owner can mark this blog as read'
      })
    }

    readingListEntry.read = req.body.read

    await readingListEntry.save()

    res.json(readingListEntry)
  } catch (error) {
    next(error)
  }
})

module.exports = router