import gql from 'graphql-tag'
import { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import { useMutation } from '@apollo/client/'
import { FETCH_POSTS_QUERY } from '../util/graphQL'


function PostForm() {
    const { values, onChange, onSubmit } = useForm(createPostCallback, { body: '' })

    //data here is similar to result
    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        //used to update local cache
        //proxy canalso be called cache
        update(proxy, result) {
            //get the data from the query
            //update it
            const data = proxy.readQuery({ query: FETCH_POSTS_QUERY })
            //writing directly to cache is not allowed
            // data.getPosts = [result.data.createPost, ...data.getPosts]
            // proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: {...result.data.createPost, ...data.getPosts} })
            const newPost = result.data.createPost;

            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [newPost, ...data.getPosts]
                }
            })
            values.body = ''
        },
        onError(err) {
            console.log(err.graphQLErrors[0].message);
        }
    })

    function createPostCallback() { createPost() }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="share a post"
                        error={error ? true : false}
                        name='body'
                        onChange={onChange}
                        value={values.body}
                    />
                    <Button type='submit' color='linkedin'> Post </Button>

                </Form.Field>
            </Form>
            {
                error && <div className="ui error message" style={{ marginBottom: 20 }}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            }
        </>
    )
}

const CREATE_POST_MUTATION = gql`
mutation CreatePost($body:String!){
    createPost(body:$body){
        id body createdAt username 
        likes{
            id username createdAt 
        }
        likeCount
        comments{
            id body username createdAt
        }
        commentCount
    }
}
`

export default PostForm
