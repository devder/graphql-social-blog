import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../util/graphQL'


function Home() {
    const { user } = useContext(AuthContext);
    // posts is an alias for getposts
    // const { loading, data: { getPosts: posts } } = useQuery(FETCH_POSTS_QUERY)
    const { loading, error, data } = useQuery(FETCH_POSTS_QUERY)

    if (loading) {
        return <h1>loading...</h1>
    }

    const { getPosts: posts } = data;
    if (error) { console.log(error); }


    return (
        <Grid columns={3}>
            <Grid.Row className='page-title'>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user && (
                        <Grid.Column>
                            <PostForm />
                        </Grid.Column>
                    )
                }

                {loading ? <h1>loading posts..</h1> :
                    <Transition.Group>
                        {
                            posts && posts.map(post =>
                                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                    < PostCard post={post} />
                                </Grid.Column>
                            )
                        }
                    </Transition.Group>
                }
            </Grid.Row>

        </Grid>
    )
}



export default Home
