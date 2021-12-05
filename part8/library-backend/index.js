const { ApolloServer, gql } = require('apollo-server');
const { nanoid } = require('nanoid');
let { authors, books } = require('./data');

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
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (args.author) {
        return books.filter((book) => book.author === args.author);
      } else if (args.genre) {
        return books.filter((book) => book.genres.includes(args.genre));
      } else {
        return books;
      }
    },
    allAuthors: () =>
      authors.map((author) => ({
        ...author,
        bookCount: books.filter((book) => book.author === author.name).length,
      })),
  },

  Mutation: {
    addBook: (root, args) => {
      const newBook = {
        title: args.title,
        author: args.author,
        published: args.published,
        genres: args.genres,
        id: nanoid(),
      };
      books = [...books, newBook];

      if (!authors.some((author) => author.name === args.author)) {
        authors = [...authors, { name: args.author, id: nanoid(), born: null }];
      }

      return newBook;
    },
    editAuthor: (root, args) => {
      const authorToEdit = authors.find((author) => author.name === args.name);

      if (!authorToEdit) {
        return null;
      }

      const updatedAuthor = { ...authorToEdit, born: args.setBornTo };

      authors = authors.map((author) => (author.name === args.name ? updatedAuthor : author));

      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
