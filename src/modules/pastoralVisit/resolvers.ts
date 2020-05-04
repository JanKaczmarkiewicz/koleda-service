import { Resolvers } from "../../types/types";
import PastoralVisit from "../../models/PastoralVisit";
import User from "../../models/User";

export const resolvers: Resolvers = {
  PastoralVisit: {
    id: (pastoralVisit) => pastoralVisit._id.toHexString(),
    priest: async (pastoralVisit) =>
      User.findOne({ _id: pastoralVisit.priest?.toHexString() }),
    acolytes: async (pastoralVisit) =>
      User.find({
        _id: { $in: pastoralVisit.acolytes },
      }),
  },
  Mutation: {
    addPastoralVisit: async (_, { input }) =>
      await new PastoralVisit(input).save(),
  },
  Query: {
    pastoralVisit: async (_, { input }) =>
      PastoralVisit.findOne({ _id: input.id }),
    pastoralVisits: async () => PastoralVisit.find(),
  },
};
