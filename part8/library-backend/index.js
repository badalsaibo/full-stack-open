const { ApolloServer, gql } = require('apollo-server');

const { authors, books } = require('./data');

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: String!
    id: String!
    genres: [String!]
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book]!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: () => books,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
