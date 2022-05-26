import {
  extendType,
  objectType,
  nonNull,
  stringArg,
  idArg,
  intArg,
} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  name: "Link", // 1
  definition(t) {
    // 2
    t.nonNull.int("id"); // 3
    t.nonNull.string("description"); // 4
    t.nonNull.string("url"); // 5
  },
});

export const LinkQuery = extendType({
  // 2
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      // 3
      type: "Link",
      resolve(parent, args, context, info) {
        // 4
        return context.prisma.link.findMany();
      },
    });
  },
});

export const LinkQueryById = extendType({
  // 2
  type: "Query",
  definition(t) {
    t.field("link", {
      // 3
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },

      resolve(parent, args, context, info) {
        const { id } = args;

        const findLinkById = context.prisma.link.findUnique({
          where: { id: id },
        });

        return findLinkById;
      },
    });
  },
});

export const LinkMutation = extendType({
  // 1
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      // 2
      type: "Link",
      args: {
        // 3
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args; // 4
        const newLink = context.prisma.link.create({
          data: {
            description: description,
            url: url,
          },
        });

        return newLink;
      },
    });
  },
});
