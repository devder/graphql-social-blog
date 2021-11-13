const { AuthenticationError } = require('apollo-server-errors')
const Post = require('../../models/post')
const checkAuth = require('../../utils/check-auth')

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },
        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId)
                if (post) {
                    return post
                } else {
                    throw new Error('Post not found')
                }

            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        //"context" here is to make sure the user is logged in
        createPost: async (_, { body }, context) => {
            // try {
            const user = checkAuth(context)

            if (body.trim() === "") {
                throw new Error('Post must not be empty')
            }
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save()
            // context.pubsub.publish("NEW_POST", { newPost: post })
            return post
            // } catch (error) {
            //     console.log(error);
            // }
        },

        deletePost: async (_, { postId }, context) => {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId)

                if (user.username === post.username) {
                    await post.delete()
                    return "Post deleted successfully"
                } else {
                    throw new AuthenticationError('Action not allowed')
                }

            } catch (error) {
                throw new Error(error)
            }
        }
    },

    // for subscriptions
    // Subscription: {
    //     newPost: {
    //         subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST")

    //     }
    // }
}