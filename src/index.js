const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

// 2
let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => links.filter(link => link.id === args.id)[0],
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const link = links.filter(link => link.id === args.id)[0];
      if (link) {
        args.description && (link.description = args.description);
        args.url && (link.url = args.url);
      }
      return link;
    },
    deleteLink: (parent, args) => {
      const link = links.filter(link => link.id === args.id)[0];
      links.splice(link, 1);
      return link;
    },
  },
};

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'utils/schema.graphql'),
    'utf8'
  ),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
