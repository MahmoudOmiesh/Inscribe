import * as textCommands from "./text-commands";
import * as markCommands from "./mark-commands";
import * as deleteCommands from "./delete-commands";

export const commands = {
  text: textCommands,
  mark: markCommands,
  delete: deleteCommands,
};

export type Command = typeof commands;
