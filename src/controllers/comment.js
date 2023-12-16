const {
    comment: commentModel,
    user_like_comment: user_like_commentModel,
    user_like_reply: user_like_replyModel,
    reply: replyModel,
    user: userModel,
    sequelize
} = require('../../models')

exports.getFindReplyQuery = (commentId) => {
    const query = {
        include: [
            {
                model: user_like_replyModel,
                as: 'user_like_reply',
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
            [sequelize.fn('COUNT', sequelize.col('user_like_reply.user_id')), 'like']
        ],
        where: {
            comment_id: commentId
        },
        group: ['reply.id', 'user.id']
    }

    return query
}

exports.likeComment = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = {
            user_id: req.userId,
            comment_id: id,
        }
        const isUserLike = await user_like_commentModel.findOne({ where: data })

        if (!isUserLike) {
            await user_like_commentModel.create(data)
        } else {
            await user_like_commentModel.destroy({ where: data })
        }

        const likeCount = await user_like_commentModel.count({
            where: {
                comment_id: id
            }
        })

        res.status(200).send({
            message: 'Like comment success',
            data: { like_count: likeCount }
        })
    } catch (error) {
        next(error)
    }
}

exports.getCommentById = async (req, res, next) => {
    try {
        const comment = await commentModel.findByPk(req.params.id, {
            attributes: ['body']
        })

        res.status(200).send({
            data: comment
        })
    } catch (error) {
        next(error)
    }
}

exports.getCommentReply = async (req, res, next) => {
    try {
        const findReplyQuery = this.getFindReplyQuery(req.params.id)
        let replies = await replyModel.findAll(findReplyQuery)

        res.status(200).send({
            data: replies
        })
    } catch (error) {
        next(error)
    }
}

exports.createCommentReply = async (req, res, next) => {
    try {
        const reply = await replyModel.create({
            user_id: req.userId,
            comment_id: req.params.id,
            body: req.body.body,
        })

        res.status(201).send({
            message: 'Create reply success'
        })
    } catch (error) {
        next(error)
    }
}

exports.updateCommentReply = async (req, res, next) => {
    try {
        const reply = await replyModel.update({ body: req.body.body }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Update reply success'
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteCommentReply = async (req, res, next) => {
    try {
        const reply = await replyModel.destroy({
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            message: 'Delete reply success'
        })
    } catch (error) {
        next(error)
    }
}