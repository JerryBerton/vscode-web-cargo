import * as vscode from 'vscode'
import * as path from 'path'

export class ListPanel {
  public static currentPanel: ListPanel | undefined;

  private readonly panel: vscode.WebviewPanel;

  private disposables: vscode.Disposable[] = [];

  private context: vscode.ExtensionContext

  private rootPath = 'web'

  constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this.panel = panel

    this.context = context

    this.panel.onDidDispose(
      () => this.dispose(), null,
      this.disposables
    );

    this.panel.webview.html = this.getWebviewContent()

    this.registerMessageListener()
    this.initMessageLister()
  }

  public static render(context: vscode.ExtensionContext) {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined

    if (ListPanel.currentPanel) {
      // 如果我们已经有了一个面板，那就把它显示到目标列布局中
      ListPanel.currentPanel.panel.reveal(columnToShowIn)
    } else {
      // 否则，创建并显示新的 Webview
      const panel = vscode.window.createWebviewPanel(
        'cargo-list', // 只供内部使用，这个 Webview 的标识
        '列表', // 给用户显示的面板标题
        vscode.ViewColumn.One, // 给新的 Webview 面板一个编辑器视图
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'web/dist'))
          ],
        } // Webview 选项。
      );

      ListPanel.currentPanel = new ListPanel(panel, context);
    }

  }

  public dispose() {
    ListPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this.panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private getWebviewContent() {
    // 获取磁盘上的资源路径
    const getDiskPath = (fileName: string) => {
      return this.panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(this.context.extensionPath, this.rootPath, 'dist', fileName)
        )
      );
    };
    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
          />
          <link rel="stylesheet" href="${getDiskPath('umi.css')}" />
        </head>
        <body>
          <div id="root"></div>
          <script src="${getDiskPath('umi.js')}"></script>
        </body>
      </html>
    `
  }

  private registerMessageListener() {
    this.panel.webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "hello":
            // @ts-ignore
            window.showInformationMessage(text);
            return;
          default:
            console.log('log', message)
        }
      },
      undefined,
      this.disposables
    );
  }

  private initMessageLister() {
    this.panel.webview.postMessage({ text: '我是王敬博' })
  }

  public async a() {
    const dirPath = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false
    })
    console.log('dirPath', dirPath)
  }
}