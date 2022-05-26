import { extendType, nonNull, objectType, stringArg } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.list.nonNull.field("links", {
      // 1
      type: "Link",
      resolve(parent, args, context) {
        // 2
        return context.prisma.user // 3
          .findUnique({ where: { id: parent.id } })
          .links();
      },
    });
  },
});

// export const UserMutation = extendType({
//   // 1
//   type: "Mutation",
//   definition(t) {
//     t.nonNull.field("post", {
//       // 2
//       type: "User",
//       args: {
//         // 3
//         name: nonNull(stringArg()),
//         email: nonNull(stringArg()),
//         password: nonNull(stringArg()),
//       },
//       resolve(parent, args, context) {
//         const { name, email, password } = args; // 4
//         const newUser = context.prisma.user.create({
//           data: {
//             name: name,
//             email: email,
//             password: password,
//           },
//         });

//         return newUser;
//       },
//     });
//   },
// });
