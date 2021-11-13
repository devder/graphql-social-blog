import React from 'react';
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
// import { ApolloProvider } from '@apollo/client/react';
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from '@apollo/client';
// import { setContext } from 'apollo-link-context'


const link = new HttpLink({
    uri: "http://localhost:5000"
    // Additional options
});

//add the authorization token
const authLink = setContext((req, prevCtx) => {
    const token = localStorage.getItem('jwtToken');

    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }
    }
})

const client = new ApolloClient({
    //used when there is no HttpLink and authlink
    // uri: 'http://localhost:5000/',
    link: authLink.concat(link),
    cache: new InMemoryCache()
});


export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)