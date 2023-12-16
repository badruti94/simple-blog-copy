const {
    post: postModel,
    user: userModel,
    user_like_post: user_like_postModel,
    user_save_post: user_save_postModel
} = require('../../models')

exports.getPostsByUsername = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query
        const posts = await postModel.findAll({
            include: {
                model: userModel,
                as: 'user',
                attributes: ['username'],
                where: {
                    username: req.params.username
                }
            },
            offset: (parseInt(page) - 1) * parseInt(perPage),
            limit: parseInt(perPage),
            order: [['id', 'ASC']],
            attributes: ['id', 'title']
        })

        res.status(200).send({
            data: posts
        })
    } catch (error) {
        next(error)
    }
}

exports.getSavedPost = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10 } = req.query
        const userSavePosts = await user_save_postModel.findAll({
            include: {
                model: postModel,
                as: 'post',
                include: {
                    model: userModel,
                    as: 'user',
                    attributes: ['username'],
                },
                attributes: ['id', 'title'],
            },
            offset: (parseInt(page) - 1) * parseInt(perPage),
            limit: parseInt(perPage),
            order: [['id', 'ASC']],
            where: {
                user_id: req.userId
            }
        })

        const posts = userSavePosts.map(userSavePost => {
            const {id, title, user} = userSavePost.dataValues.post
            return {
                id, title, user
            }
        })

        res.status(200).send({
            data: posts
        })
    } catch (error) {
        next(error)
    }
}