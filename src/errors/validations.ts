import { RecordState } from "../types/types";

export const passwordError = {
  required: "No password provided.",
  min: (min: number) =>
    `Password is too short - should be ${min} chars minimum.`,
  format: "Password can only contain Latin letters.",
};

export const emailError = {
  format: "Should be email",
  required: "No email provided.",
};

export const usernameError = {
  format: "Username may contain A-z 0-9 chars.",
  required: "No username provided.",
};

export const streetError = {
  exist: "Street already exist!",
};

export const seasonError = {
  exist: "Season already exist!",
};

export const pastoralVisitError = {
  stateFormat: `State should be one of: ${Object.values(RecordState).join(
    ", "
  )}!`,
  timeValues: `Reece should be before a visit`,
};
