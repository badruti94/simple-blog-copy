const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const {mustRole} = require('../middlewares/auth')

router.get('/:username/post', userController.getPostsByUsername)
router.get('/save', mustRole('user'), userController.getSavedPost)

module.exports = router