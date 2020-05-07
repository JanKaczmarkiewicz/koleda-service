import { ApolloServer } from "apollo-server";

import { resolvers, typeDefs, directives } from "../modules";
import getUserBasedOnToken from "../utils/getUserBasedOnToken";
import { Context, ServerOptions } from "../types/util";

export default (options?: ServerOptions) => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives: directives,
    context: async (expressContext) => {
      const token: string | undefined =
        expressContext.req?.headers.authorization ?? options?.token;

      const user = token ? await getUserBasedOnToken(token) : null;
      if (user) user.confirmed = true;
      return {
        req: expressContext.req,
        res: expressContext.res,
        user,
      } as Context;
    },
  });

  return server;
};
