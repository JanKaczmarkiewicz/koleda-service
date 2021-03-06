import { Streets } from "./_housesAndStreets";
import {
  PastoralVisitDbObject,
  EntranceDbObject,
  RecordState,
} from "../types/types";
import Entrance from "../models/Entrance";
import Day from "../models/Day";
import * as mongoose from "mongoose";

const random = (from: number, to: number) =>
  Math.floor(Math.random() * (to - from)) + from;

export const getKeys = <T extends {}>(o: T): (keyof T)[] =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  Object.keys(o) as (keyof T)[];

function* houseGenerator(streets: Streets) {
  for (const streetName of getKeys(streets))
    for (const house of streets[streetName]) {
      yield house;
    }
}

const randomComment = () => {
  const preposition = Math.random() > 0.5 ? "po" : "przed";
  return `${preposition} ${random(17, 21)}`;
};

export const createEntrances = async (
  streets: Streets,
  pastoralVisits: PastoralVisitDbObject[]
) => {
  const houses = houseGenerator(streets);

  const daysAssignedStreets: { [key: string]: Set<mongoose.Types.ObjectId> } = {};

  const entrancesData = pastoralVisits.flatMap((pastoralVisit) => {
    const randomNumberOfHouses = random(25, 36);
    const currentDayId = pastoralVisit.day!.toHexString();

    if (daysAssignedStreets[currentDayId] === undefined) {
      daysAssignedStreets[currentDayId] = new Set<mongoose.Types.ObjectId>();
    }

    const entrances = [];
    for (let i = 0; i < randomNumberOfHouses; i++) {
      const house = houses.next().value;
      if (!house) break;

      if (Math.random() > 0.5) continue;

      const comment = Math.random() > 0.9 ? randomComment() : null;

      daysAssignedStreets[currentDayId].add(house.street!);

      const entrance = {
        house: house._id,
        pastoralVisit: pastoralVisit._id,
        comment,
        reeceState:
          Math.random() > 0.5 ? RecordState.Accepted : RecordState.Uncertain,
        visitState:
          Math.random() > 0.5 ? RecordState.Accepted : RecordState.Rejected,
      };
      entrances.push(entrance);
    }

    return entrances;
  });

  const p1 = Object.keys(daysAssignedStreets).map((dayId) =>
    Day.findByIdAndUpdate(dayId, {
      $set: {
        assignedStreets: [...daysAssignedStreets[dayId]],
      },
    })
  );

  const p2 = entrancesData.map((data) => new Entrance(data).save());

  return Promise.all([Promise.all(p2), Promise.all(p1)]);
};
