import { Resolvers } from "../../types/types";
import Entrance from "../../models/Entrance";
import House from "../../models/House";
import PastoralVisit from "../../models/PastoralVisit";
import { validateArgs } from "../../utils/validateArgs";
import { addEntranceValidation } from "./validators";

export const resolvers: Resolvers = {
  Entrance: {
    id: (entrance) => entrance._id.toHexString(),

    house: async (entrance) =>
      House.findOne({ _id: entrance.house?.toHexString() }),

    pastoralVisit: async (entrance) =>
      PastoralVisit.findOne({ _id: entrance.pastoralVisit?.toHexString() }),
  },
  Mutation: {
    addEntrance: async (_, { input }) => new Entrance(input).save(),

    addEntrances: async (_, { input: { houses, pastoralVisit } }) => {
      const docs = houses.map((house) => ({ house, pastoralVisit }));
      return Entrance.insertMany(docs);
    },

    updateEntrance: async (_, { input: { id, ...rest } }) =>
      Entrance.findOneAndUpdate({ _id: id }, { $set: rest }, { new: true }),

    updateEntrances: async (_, { input: { ids, ...rest } }) =>
      Entrance.updateMany({ _id: { $in: ids } }, { $set: rest }),

    deleteEntrance: async (_, { input }) =>
      (await Entrance.findByIdAndDelete(input.id)) ? true : false,

    deleteEntrances: async (_, { input }) => {
      const { ok } = await Entrance.deleteMany({ id: { $in: input.ids } });
      return ok && ok === 1 ? true : false;
    },
  },
  Query: {
    entrance: async (_, { input }) => Entrance.findOne({ _id: input.id }),
  },
};
