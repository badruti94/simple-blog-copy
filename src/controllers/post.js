const uniqid = require('uniqid')
const { Op } = require('sequelize')
const {
    post: postModel,
    user: userModel,
    user_like_post: user_like_postModel,
    user_save_post: user_save_postModel,
    comment: commentModel,
    user_like_comment: user_like_commentModel,
    user_like_reply: user_like_replyModel,
    reply: replyModel,
    sequelize
} = require('../../models')
const { postSchema } = require('../validations/post')
const { imageValidation } = require('../validations/image')
const { uploadToCloudinary } = require('../utils/upload')
const { getFindReplyQuery } = require('./comment')

const getFindCommentQuery = (postId) => {
    const query = {
        include: [
            {
                model: user_like_commentModel,
                as: 'user_like_comment',
                attributes: [],
                left: true,
            },
            {
                model: userModel,
                as: 'user',
                attributes: ['username', 'name']
            },
        ],
        attributes: [
            'id', 'body', 'createdAt',
            [sequelize.fn('COUNT', sequelize.col('user_like_comment.user_id')), 'like']
        ],
        where: {
            post_id: postId
        },
        group: ['comment.id', 'user.id'],
        order: [['id', 'DESC']]
    }

    return query
}

exports.getAllPost = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, search = '' } = req.query
        const posts = await postModel.findAll({
            include: {
                model: userModel,
                as: 'user',
                attributes: ['username', 'name']
            },
            where: {
                title: {
                    [Op.iLike]: `%${search}%`
                },
                publish: true,
            },
            offset: (parseInt(page) - 1) * parseInt(perPage),
            limit: parseInt(perPage),
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'title', 'createdAt']
        })

        const totalData = await postModel.count({
            where: {
                title: {
                    [Op.iLike]: `%${search}%`
                }
            },
        })

        res.status(200).send({
            data: posts,
            total_data: totalData,
        })
    } catch (error) {
        next(error)
    }
}

exports.getPostDashboard = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, search = '' } = req.query
        const posts = await postModel.findAll({
            where: {
                user_id: req.userId
            },
            offset: (parseInt(page) - 1) * parseInt(perPage),
            limit: parseInt(perPage),
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'title', 'view', 'createdAt', 'publish']
        })

        const totalData = await postModel.count({
            where: {
                user_id: req.userId
            },
        })

        res.status(200).send({
            data: posts,
            total_data: totalData,
        })
    } catch (error) {
        next(error)
    }
}

exports.getPostById = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await postModel.findByPk(id, {
            include: [
                {
                    model: userModel,
                    as: 'user',
                    attributes: ['username', 'name']
                },
                {
                    model: user_like_postModel,
                    as: 'user_like_post',
                    attributes: []
                },
            ],
            attributes: [
                'id', 'title', 'body', 'view', 'createdAt',
                [sequelize.fn('COUNT', sequelize.col('user_like_post.user_id')), 'like'],
            ],
            group: ['post.id', 'user.id']
        })
        if (!post) {
            const error = new Error('Post not found')
            error.errorCode = 404
            throw error
        }

        const comment = await commentModel.count({
            where: {
                post_id: id
            }
        })

        post.dataValues.comment = comment

        res.status(200).send({
            data: post
        })
    } catch (error) {
        next(error)
    }
}

exports.getPostEditById = async (req, res, next) => {
    try {
        const post = await postModel.findByPk(req.params.id, {
            attributes: ['title', 'body', 'publish',]
        })

        res.status(200).send({
            data: post
        })
    } catch (error) {
        next(error)
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const { error } = postSchema.validate(req.body)
        if (error) throw error

        const slug = req.body.title.toLowerCase().split(' ').join('-') + '-' + uniqid().slice(-4)

        console.log(req.body);
        const post = await postModel.create({
            ...req.body,
            slug,
            user_id: req.userId
        })
        res.status(201).send({
            message: 'Create post success'
        })
    } catch (error) {
        next(error)
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const { error } = postSchema.validate(req.body)
        if (error) throw error

        const post = await postModel.update(req.body, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Update post success'
        })
    } catch (error) {
        next(error)
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const post = await postModel.destroy({
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Delete post success'
        })
    } catch (error) {
        next(error)
    }
}

exports.likePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = {
            user_id: req.userId,
            post_id: id,
        }
        const isUserLike = await user_like_postModel.findOne({ where: data })

        if (!isUserLike) {
            await user_like_postModel.create(data)
        } else {
            await user_like_postModel.destroy({ where: data })
        }

        const likeCount = await user_like_postModel.count({
            where: {
                post_id: id
            }
        })

        res.status(200).send({
            message: 'Like post success',
            data: { like_count: likeCount }
        })
    } catch (error) {
        next(error)
    }
}

exports.getPostLikeCount = async (req, res, next) => {
    try {
        const like = await user_like_postModel.count({
            where: {
                post_id: req.params.id
            }
        })

        res.status(200).send({
            data: like
        })
    } catch (error) {
        next(error)
    }
}

exports.getCommentCount = async (req, res, next) => {
    try {
        const commentCount = await commentModel.count({
            where: {
                post_id: req.params.id
            }
        })

        res.status(200).send({
            data: commentCount
        })
    } catch (error) {
        next(error)
    }
}

exports.unlikePost = async (req, res, next) => {
    try {
        const user_id = req.userId
        const post_id = req.params.id
        await user_like_postModel.destroy({
            where: {
                user_id,
                post_id,
            }
        })

        res.status(200).send({
            message: 'Unlike post success'
        })
    } catch (error) {
        next(error)
    }
}

exports.isLikePost = async (req, res, next) => {
    try {
        const user_id = req.userId
        const post_id = req.params.id
        const like = await user_like_postModel.findOne({
            where: {
                user_id,
                post_id,
            }
        })

        res.status(200).send({
            data: like ? true : false
        })
    } catch (error) {
        next(error)
    }
}

exports.savePost = async (req, res, next) => {
    try {
        const user_id = req.userId
        const post_id = req.params.id
        const userSavePost = await user_save_postModel.findOrCreate({
            where: {
                user_id,
                post_id,
            }
        })

        res.status(200).send({
            message: 'Save post success'
        })
    } catch (error) {
        next(error)
    }
}

exports.unsavedPost = async (req, res, next) => {
    try {
        const user_id = req.userId
        const post_id = req.params.id
        await user_save_postModel.destroy({
            where: {
                user_id,
                post_id,
            }
        })

        res.status(200).send({
            message: 'Unsave post success'
        })
    } catch (error) {
        next(error)
    }
}

exports.isSavePost = async (req, res, next) => {
    try {
        const user_id = req.userId
        const post_id = req.params.id
        const save = await user_save_postModel.findOne({
            where: {
                user_id,
                post_id,
            }
        })

        res.status(200).send({
            data: save ? true : false
        })
    } catch (error) {
        next(error)
    }
}

exports.getSavedPost = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query

        const userSavedPosts = await user_save_postModel.findAll({
            include: {
                include: {
                    model: userModel,
                    as: 'user',
                    attributes: ['username', 'name']
                },
                model: postModel,
                as: 'post',
                attributes: ['id', 'title', 'createdAt']
            },
            where: {
                user_id: req.userId
            },
            offset: (parseInt(page) - 1) * parseInt(perPage),
            limit: parseInt(perPage),
            order: [['createdAt', 'DESC']],
            attributes: ['id']
        })

        const posts = userSavedPosts.map(userSavedPost => userSavedPost.dataValues.post)

        const totalData = await user_save_postModel.count({
            where: {
                user_id: req.userId
            }
        })

        res.status(200).send({
            data: posts,
            total_data: totalData,
        })
    } catch (error) {
        next(error)
    }
}

exports.getPostComment = async (req, res, next) => {
    try {
        const findCommentQuery = getFindCommentQuery(req.params.id)
        let comments = await commentModel.findAll(findCommentQuery)

        const getReplies = async (comment_id) => {
            const findReplyQuery = getFindReplyQuery(comment_id)
            let replies = await replyModel.findAll(findReplyQuery)

            replies = replies.map(reply => ({ ...reply.dataValues }))

            return replies
        }

        const replies = await Promise.all(comments.map(comment => {
            return getReplies(comment.id)
        }))

        comments = comments.map((comment, i) => ({
            ...comment.dataValues,
            replies: replies[i]
        }))

        res.status(200).send({
            data: comments
        })
    } catch (error) {
        next(error)
    }
}

exports.createPostComment = async (req, res, next) => {
    try {
        const { id } = req.params

        let comment = await commentModel.create({
            user_id: req.userId,
            post_id: id,
            body: req.body.body,
        })
        const findCommentQuery = getFindCommentQuery(id)
        comment = await commentModel.findByPk(comment.id, findCommentQuery)

        comment = { ...comment.dataValues, replies: [] }

        const commentCount = await commentModel.count({
            where: {
                post_id: req.params.id
            }
        })

        res.status(201).send({
            message: 'Create comment success',
            data: {
                comment,
                comment_count: commentCount,
            }
        })
    } catch (error) {
        next(error)
    }
}

exports.updatePostComment = async (req, res, next) => {
    try {
        const comment = await commentModel.update({ body: req.body.body }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Update comment success'
        })
    } catch (error) {
        next(error)
    }
}

exports.deletePostComment = async (req, res, next) => {
    try {
        const comment = await commentModel.destroy({
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Delete comment success'
        })
    } catch (error) {
        next(error)
    }
}

exports.uploadImage = async (req, res, next) => {
    try {
        imageValidation(req.files, 'image')
        console.log(req.files);
        const secure_url = await uploadToCloudinary(req.files.image)

        res.status(200).send({
            data: secure_url
        })
    } catch (error) {
        next(error)
    }
}

exports.incrementPostView = async (req, res, next) => {
    try {
        await postModel.increment({
            view: 1
        }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({ message: 'Increment view success' })
    } catch (error) {
        next(error)
    }
}