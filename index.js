const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const logger = require('morgan')
const cors = require('cors')
const app = require('express')()
const typeDefs = require('./graphQL/typeDefs')
const resolvers = require('./graphQL/resolvers')
const { DATABASEURI } = require('./config')

const port = process.env.PORT || 5000
//for subscriptions
const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, pubsub })
})

mongoose.set('debug', true)
mongoose.Promise = global.Promise;
mongoose.connect(DATABASEURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => server.listen({ port }))
    .then(res => console.log(`server running at ${res.url},\nconnected to db`))
    .catch(error => console.log(error.message));

app.use(logger('dev'));
// app.use(cors());




