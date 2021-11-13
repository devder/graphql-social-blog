import { useState } from 'react'
import { Icon, Confirm, Button, Popup } from "semantic-ui-react";
import { useMutation, gql } from '@apollo/client'
import { FETCH_POSTS_QUERY } from '../util/graphQL';



const DeleteButton = ({ postId, callback, commentId }) => {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrMutation] = useMutation(mutation, {
        //comment id will be ignored if need be
        variables: { postId, commentId },
        //this runs after the query/mutation has gone
        update(proxy, _) {
            setConfirmOpen(false)
            if (!commentId) {
                const data = proxy.readQuery({ query: FETCH_POSTS_QUERY })
                const newPosts = data.getPosts.filter(post => post.id !== postId)
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: [...newPosts]
                    }
                })
            }
            if (callback) { callback() }
            //TODO : remove post from cache

        },
        onError(err) {
            console.log(err);
        }
    })


    return (
        <>
            <Popup inverted content={commentId ? 'Delete Comment' : "Delete Post"} trigger={<Button onClick={() => setConfirmOpen(true)} color='red' floated="right" >
                <Icon name='trash' style={{ margin: 0 }} />
            </Button>} />
            <Confirm
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            >

            </Confirm>
        </>
    )
}

const DELETE_POST_MUTATION = gql`
mutation DeletePost($postId:ID!){
    deletePost(postId:$postId)
}
`

const DELETE_COMMENT_MUTATION = gql`
mutation DeleteComment($postId:ID!, $commentId:ID!){
    deleteComment(postId:$postId , commentId:$commentId){
        id body comments {
          id username createdAt
        }
    commentCount
    }
}
`


export default DeleteButton
