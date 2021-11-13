import { useContext } from 'react'
import { Card, Icon, Label, Button, Image, Popup } from "semantic-ui-react";
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from '../context/auth'
import Likebutton from './Likebutton';
import DeleteButton from './DeleteButton';

function PostCard({ post: { body, createdAt, username, id, likeCount, likes, commentCount } }) {

    const { user } = useContext(AuthContext)




    return (
        <Card.Group>
            <Card fluid>
                <Card.Content>
                    <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                    />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                    <Card.Description>
                        {body}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Likebutton user={user} post={{ id, likes, likeCount }} />
                    <Popup inverted content="Comment on post" trigger={
                        <Button as={Link} to={`/post/${id}`} labelPosition='right'>
                            <Button color='blue' basic>
                                <Icon name='comments' />
                            </Button>
                            <Label basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    } />



                    {user && user.username === username && <DeleteButton postId={id} />}
                </Card.Content>
            </Card>
        </Card.Group>
    )
}

export default PostCard
