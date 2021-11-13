import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

function Register({ history }) {
    const { login } = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    //arangements is important here in terms of hoisting and accessing variables
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: "",
        password: "",
    });


    const [loginUser, { loading: mutationLoading, error: mutationError }] = useMutation(LOGIN_USER, {
        // update(proxy, result) {console.log(result.data.login)}
        update(proxy, { data: { login: userData } }) {
            login(userData)
            history.push('/')
        },
        onError(err) {
            if (err.graphQLErrors.length > 0) {
                setErrors(err.graphQLErrors[0].extensions.exception.errors)
            }
        },
        // onError(err) {
        //     console.log(err);
        //     // setErrors(err.graphQLErrors[0].extensions.exception.errors)
        // },
        //for automatic revalidation
        //     onError(({ graphQLErrors, networkError, operation, forward }) => {
        //     if (graphQLErrors) {
        //         for (let err of graphQLErrors) {
        //             switch (err.extensions.code) {
        //                 // Apollo Server sets code to UNAUTHENTICATED
        //                 // when an AuthenticationError is thrown in a resolver
        //                 case 'UNAUTHENTICATED':

        //                     // Modify the operation context with a new token
        //                     const oldHeaders = operation.getContext().headers;
        //                     operation.setContext({
        //                         headers: {
        //                             ...oldHeaders,
        //                             authorization: getNewToken(),
        //                         },
        //                     });
        //                     // Retry the request, returning the new observable

        //                     return forward(operation);
        //             }
        //         }
        //     }

        // }),

        variables: values,
        errorPolicy: "all"
    })

    const errorsArray = mutationError ? Object.values(mutationError.graphQLErrors[0].extensions.exception.errors) : null


    function loginUserCallback() { loginUser(); }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={mutationLoading ? "loading" : ""}>
                <h1>Login</h1>
                <Form.Input
                    label='Username'
                    placeholder='Username...'
                    name='username'
                    type='text'
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange} />


                <Form.Input
                    label='Password'
                    placeholder='Password...'
                    error={errors.password ? true : false}
                    type='password'
                    name='password'
                    value={values.password}
                    onChange={onChange} />

                <Button type='submit' primary>Login</Button>

            </Form>


            { errorsArray && <div className="ui error message">
                <ul className="list">
                    {errorsArray.map(error => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            </div>}
        </div>
    )
}


const LOGIN_USER = gql`
mutation login($username:String! $password:String!){
  login(username:$username, password:$password){
    id
    createdAt
    username
    email
    token
  }
}
`



export default Register