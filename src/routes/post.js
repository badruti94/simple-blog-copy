const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')
const {mustRole} = require('../middlewares/auth')

router.get('/', postController.getAllPost)
router.get('/dashboard', mustRole('user'), postController.getPostDashboard)
router.get('/save', mustRole('user'),  postController.getSavedPost)
router.get('/:id', postController.getPostById)
router.get('/:id/edit', postController.getPostEditById)
router.post('/', mustRole('user'), postController.createPost)
router.put('/:id', mustRole('user'), postController.updatePost)
router.delete('/:id', mustRole('user'), postController.deletePost)
router.post('/:id/like', mustRole('user'), postController.likePost)
router.delete('/:id/like', mustRole('user'), postController.unlikePost)
router.get('/:id/like', mustRole('user'), postController.isLikePost)
router.get('/:id/like/count', postController.getPostLikeCount)
router.get('/:id/comment/count', postController.getCommentCount)
router.post('/:id/save', mustRole('user'),  postController.savePost)
router.delete('/:id/save', mustRole('user'),  postController.unsavedPost)
router.get('/:id/save', mustRole('user'),  postController.isSavePost)

router.get('/:id/comment', postController.getPostComment)
router.post('/:id/comment', mustRole('user'), postController.createPostComment)
router.put('/comment/:id', mustRole('user'), postController.updatePostComment)
router.delete('/comment/:id', mustRole('user'), postController.deletePostComment)

router.post('/image', postController.uploadImage)

router.patch('/:id/view', postController.incrementPostView)

module.exports = router
