import React, { useState, useEffect, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'


function Register({ history }) {
    const { login } = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    //arangements is important here in terms of hoisting and accessing variables
    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: "",
        password: "",
        confirmPassword: ""
    });


    const [addUser, { loading: mutationLoading, error: mutationError }] = useMutation(REGISTER_USER, {
        // update(proxy, result) {
        update(proxy, { data: { register: userData } }) {
            login(userData)
            history.push('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values,
        errorPolicy: "all"
    })

    useEffect(() => {
        if (mutationError) setErrors(mutationError.graphQLErrors[0].extensions.exception.errors)

    }, [mutationError])
    function registerUser() { addUser(); }

    // const onSubmit = (e) => {
    //     e.preventDefault()
    //     addUser()
    // }

    // if (mutationLoading) return <p>Loading...</p>

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={mutationLoading ? "loading" : ""}>
                <h1>Register</h1>
                <Form.Input
                    label='Username'
                    placeholder='Username...'
                    name='username'
                    type='text'
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange} />
                <Form.Input
                    label='Email'
                    placeholder='Email...'
                    type='email'
                    error={errors.email ? true : false}
                    name='email'
                    value={values.email}
                    onChange={onChange} />


                <Form.Input
                    label='Password'
                    placeholder='Password...'
                    error={errors.password ? true : false}
                    type='password'
                    name='password'
                    value={values.password}
                    onChange={onChange} />

                <Form.Input
                    label='Confirm Password'
                    placeholder='Confirm Password...'
                    type='password'
                    error={errors.confirmPassword ? true : false}
                    name='confirmPassword'
                    value={values.confirmPassword}
                    onChange={onChange} />

                <Button type='submit' primary>Register</Button>

            </Form>

            {Object.keys(errors).length > 0 && <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(error => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            </div>}
        </div>
    )
}


const REGISTER_USER = gql`
mutation Register($username:String! $email:String! $password:String! $confirmPassword:String!){
  register(registerInput:{username: $username email: $email password: $password confirmPassword: $confirmPassword}){
    id
    email
    username
    createdAt
    token
  }
}
`



export default Register