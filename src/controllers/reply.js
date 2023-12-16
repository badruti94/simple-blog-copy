const {
    reply: replyModel,
    user_like_reply: user_like_replyModel
} = require('../../models')

exports.likeReply = async (req, res, next) => {
    try {
        const { id } = req.params
        const data = {
            user_id: req.userId,
            reply_id: id,
        }

        const isUserLike = await user_like_replyModel.findOne({ where: data })

        if (!isUserLike) {
            await user_like_replyModel.create(data)
        } else {
            await user_like_replyModel.destroy({ where: data })
        }

        const likeCount = await user_like_replyModel.count({
            where: {
                reply_id: id
            }
        })

        res.status(200).send({
            message: 'Like reply success',
            data: { like_count: likeCount }
        })
    } catch (error) {
        next(error)
    }
}

exports.getReplyById = async (req, res, next) => {
    try {
        const reply = await replyModel.findByPk(req.params.id, {
            attributes: ['body']
        })

        res.status(200).send({
            data: reply
        })
    } catch (error) {
        next(error)
    }
}