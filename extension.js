// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sequence-diagram-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.sequence-diagram-render', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const panel = vscode.window.createWebviewPanel(
			"sequenceDiagramRender",
			"Sequence Diagram Preview",
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				// Only allow the webview to access resources in our extension's media directory
				localResourceRoots: [
					vscode.Uri.file(path.join(context.extensionPath, 'html/js'))
				]
			}
		);

		const currentFile = vscode.window.activeTextEditor.document.uri;

		const sd = vscode.Uri.file(
			path.join(context.extensionPath, 'html/js', 'sequence-diagram-min.js')
		);

		// And get the special URI to use with the webview
		const webfontPath = panel.webview.asWebviewUri(
			vscode.Uri.file(
				path.join(context.extensionPath, 'html/js', 'webfont.js')
			)
		)
		const snapPath = panel.webview.asWebviewUri(
			vscode.Uri.file(
				path.join(context.extensionPath, 'html/js', 'snap.svg-min.js')
			)
		)
		const underscorePath = panel.webview.asWebviewUri(
			vscode.Uri.file(
				path.join(context.extensionPath, 'html/js', 'underscore-min.js')
			)
		)
		const sdPath = panel.webview.asWebviewUri(sd);

		
		vscode.workspace.openTextDocument(currentFile).then((document) => {
			let content = document.getText();
			// And set its HTML content
			panel.webview.html = getWebviewContent(
				webfontPath,
				snapPath,
				underscorePath,
				sdPath,
				content
			);
		});



	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(webfontPath,snapPath,underscorePath,sdPath,sequenceSpec){
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Sequence Diagram Preview</title>
			<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
			<script src="${webfontPath}"></script>
			<script src="${snapPath}"></script>
			<script src="${underscorePath}"></script>
			<script src="${sdPath}"></script>
	
	</head>
	<body>  
		<div style="background:white" id="diagram">${sequenceSpec}</div>
		<script>
			$("#diagram").sequenceDiagram({theme:'simple'});	
		</script>
	</body>
	</html>`;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
