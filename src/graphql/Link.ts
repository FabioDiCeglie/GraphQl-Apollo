import { extendType, objectType, nonNull, stringArg, intArg } from "nexus";

export const Link = objectType({
  name: "Link", // 1
  definition(t) {
    // 2
    t.nonNull.int("id"); // 3
    t.nonNull.string("description"); // 4
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt");
    t.field("postedBy", {
      // 1
      type: "User",
      resolve(parent, args, context) {
        // 2

        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

export const LinkQuery = extendType({
  // 2
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      // 3
      type: "Link",
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
      },
      resolve(parent, args, context, info) {
        const where = args.filter
          ? {
              OR: [
                { description: { contains: args.filter } },
                {
                  url: { contains: args.filter },
                },
              ],
            }
          : {};
        // 4
        return context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
        });
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
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        const { description, url } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } },
          },
        });

        return newLink;
      },
    });
  },
});
