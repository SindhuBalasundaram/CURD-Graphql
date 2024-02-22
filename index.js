import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import db from './_db.js';

//types
import { typeDefs } from './schema.js';

const resolvers = {
    Query: {
        games(){
            return db.games
        },
        singleGame(_, args){
            return db.games.find((singleGame)=> singleGame.id === args.id)
        },
        reviews(){
            return db.reviews
        },
        singleReview(_, args){
            return db.reviews.find((singleReview)=> singleReview.id === args.id)
        },
        authors(){
            return db.authors
        },
        singleAuthor(_, args){
            return db.authors.find((singleAuthor)=> singleAuthor.id === args.id)
        }
    },
    Game: {
        reviews(parent){
            return db.reviews.filter((r)=> r.game_id === parent.id)
        }
    },
    Review: {
        author(parent) {
          return db.authors.find((a) => a.id === parent.author_id)
        },
        game(parent) {
          return db.games.find((g) => g.id === parent.game_id)
        }
      },
      Author: {
        reviews(parent) {
          return db.reviews.filter((r) => r.author_id === parent.id)
        }
      },
    Mutation: {
        addGame(_, args) {
            let game = {
                ...args.game,
                id:Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(game)

            return game
        },
        deleteGame(_,args) {
            db.games = db.games.filter((g)=> g.id !== args.id)
            return db.games
        },
        updateGame(_, args) {
            db.games = db.games.map((g) => {
              if (g.id === args.id) {
                return {...g, ...args.edits}
              }
      
              return g
            })
      
            return db.games.find((g) => g.id === args.id)
          }
    }
}
// server setup
const server = new ApolloServer({
    typeDefs,
    resolvers
 }
)

const { url } = await startStandaloneServer(server, {
    listen: { port : 4000 }
})

console.log("Server started already!!", 4000)