import * as vscode from 'vscode'

import { ListPanel } from './panels/list'
import { getConfig } from './utils/getDir'
export function activate(context: vscode.ExtensionContext) {
  getConfig()
  const showCargoListCommand = vscode.commands.registerCommand("cargo.start", () => {
    ListPanel.render(context);
  });
  context.subscriptions.push(showCargoListCommand);

}

export function deactivate() { }
