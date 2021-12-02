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

  type Author {
    name: String!
    bookCount: Int!
    id: String!
    born: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book]!
    allAuthors: [Author!]!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: () => books,
    allAuthors: () =>
      authors.map((author) => ({
        ...author,
        bookCount: books.filter((book) => book.author === author.name).length,
      })),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
