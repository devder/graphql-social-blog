import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import { Icon, Label, Button, } from "semantic-ui-react";




function Likebutton({ user, post: { id, likes, likeCount } }) {

    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else {
            setLiked(false)
        }

    }, [user, likes])

    const [likePost, { error: mutationError }] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        onError(err) {
            console.log(err);
        }

    })

    const likeButton = user ? (
        liked ?
            <Button color='teal'>
                <Icon name='heart' />
            </Button> :
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
    ) : <Button as={Link} to='/login' color='teal' basic>
        <Icon name='heart' />
    </Button>

    return (
        <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label basic color='teal' pointing='left'>
                {likeCount}
            </Label>
        </Button>
    )
}

const LIKE_POST_MUTATION = gql`
mutation LikePost($postId:ID!){
    likePost(postId:$postId){
        id likes{
            id username
        }
        likeCount
    }
}
`

export default Likebutton
