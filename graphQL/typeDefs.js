const gql = require('graphql-tag')

module.exports = gql`
    type Post{
        id: ID!
        body: String!
        createdAt:String!
        username:String!
        comments:[Comment]! 
        likes:[Like]!
        likeCount:Int!
        commentCount:Int!
    }
    type Comment{
        id:ID!
        body:String!
        createdAt:String!
        username:String!

    }
    type Like{
        id:ID!
        createdAt:String!
        username:String!
    }
    type User{
        id:ID!
        email:String!
        token: String!
        username: String!
        createdAt: String!

    }
    input RegisterInput{
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query{
        getPosts : [Post!]
        getPost(postId:ID!):Post!
    }

    type Mutation{
        # registerInput needs a type
        register(registerInput: RegisterInput): User!
        # no need for type here
        login(username: String!, password: String!) : User!
        createPost(body:String!):  Post!
        deletePost(postId:ID!):String!
        createComment(postId:String!, body: String!): Post!
        deleteComment(postId:ID!, commentId: ID!): Post!
        likePost(postId:ID!):Post!
    }
    # type Subscription{
    #     newPost: Post!
    # }
`