import * as textCommands from "./text";
import * as deleteCommands from "./delete";
import * as formatCommands from "./format";
import * as listCommands from "./list";
import * as historyCommands from "./history";

import { Transaction, type Step } from "../state/transaction";
import type { EditorState } from "../state/editor-state";

function customCommand(state: EditorState, steps: Step[]) {
  const transaction = new Transaction(state);
  for (const step of steps) {
    transaction.add(step);
  }
  return transaction;
}

export {
  textCommands,
  deleteCommands,
  formatCommands,
  listCommands,
  historyCommands,
  customCommand,
};
