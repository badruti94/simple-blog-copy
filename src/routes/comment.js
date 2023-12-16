const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment')
const { mustRole } = require('../middlewares/auth')

router.get('/:id', commentController.getCommentById)
router.post('/:id/like', mustRole('user'), commentController.likeComment)
router.get('/:id/reply', commentController.getCommentReply)
router.post('/:id/reply', mustRole('user'), commentController.createCommentReply)
router.put('/reply/:id', mustRole('user'), commentController.updateCommentReply)
router.delete('/reply/:id', mustRole('user'), commentController.deleteCommentReply)

module.exports = router
