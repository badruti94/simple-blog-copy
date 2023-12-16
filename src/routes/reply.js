const express = require('express')
const router = express.Router()
const replyController = require('../controllers/reply')
const { mustRole } = require('../middlewares/auth')

router.get('/:id', replyController.getReplyById)
router.post('/:id/like', mustRole('user'), replyController.likeReply)


module.exports = router
