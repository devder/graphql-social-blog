import { useContext, useState, useRef } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
import { Button, Card, Grid, Image, Icon, Label, Form } from 'semantic-ui-react'
import moment from 'moment'
import Likebutton from '../components/Likebutton'
import { AuthContext } from "../context/auth"
import DeleteButton from '../components/DeleteButton'

const SinglePost = (props) => {
    const { postId } = props.match.params
    const { user } = useContext(AuthContext)
    const [comment, setComment] = useState('')
    const commentInputRef = useRef()

    const { data, error, loading } = useQuery(FETCH_POST_QUERY, {
        variables: { postId: postId }
    })



    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        variables: { postId, body: comment },
        update() {
            setComment("")
            commentInputRef.current.blur()
        }
    })

    function deletePostCallback() {
        props.history.push('/')
    }

    if (loading) return <h3>loading...</h3>
    const { getPost } = data;

    let postMarkup;


    if (!getPost) {
        postMarkup = <h3>loading...</h3>
    } else {
        const { id, body, username, createdAt, comments, likes, likeCount, commentCount } = getPost;

        postMarkup =
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />

                            <Card.Content extra>
                                <Likebutton user={user} post={{ id, likes, likeCount }} />
                                <Button as='div' labelPosition='right'>
                                    <Button basic color='blue'>
                                        <Icon name='comments' />
                                    </Button>
                                    <Label basic color='blue' pointing='left'>{commentCount}</Label>
                                </Button>
                                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback} />}
                            </Card.Content>
                        </Card>

                        {user && (
                            <Card fluid>
                                <Card.Content>

                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action fluid input">
                                            <input
                                                type='text'
                                                placeholder="Comment..."
                                                name='comment'
                                                value={comment}
                                                ref={commentInputRef}
                                                onChange={e => setComment(e.target.value)}
                                            />
                                            <button type='submit' className='ui button teal'
                                                disabled={comment.trim() === ""}
                                                onClick={submitComment}
                                            >Comment</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}

                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && <DeleteButton postId={id} commentId={comment.id} />}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}

                    </Grid.Column>
                </Grid.Row>
            </Grid>
    }

    return postMarkup;

}

const FETCH_POST_QUERY = gql`
query GetPost($postId:ID!){
    getPost(postId:$postId){
        id body createdAt likeCount username
        likes{
            username
        }
        commentCount
        comments{
            id username createdAt body
        }
    }
}
`

const SUBMIT_COMMENT_MUTATION = gql`
mutation($postId:String!, $body:String!){
    createComment(postId:$postId, body: $body){
  body id comments{
      id body createdAt username
  }
  commentCount
}
}
`

export default SinglePost
