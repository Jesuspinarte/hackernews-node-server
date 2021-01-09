const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: (parent, args) => links.filter(link => link.id === args.id)[0],
  },
  Mutation: {
    post: (parent, args, context) => {
      return context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
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
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
