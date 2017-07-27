var vscode = require('vscode');

// Default options
const options = {
	isDeactivated: false,
	setIntervalId: null,
	oldThemeColor: '',
	themeColor: 'Default High Contrast'
};

function activate(context) {
	var activateEvent = vscode.commands.registerCommand('extension.activate', function () {
		const config = vscode.workspace.getConfiguration('workbench');

		options.isDeactivated = false;
		
		const currentDate = new Date();
		const currentHours = currentDate.getHours();

		changeTheme(); //Change theme while activating ext

		options.setIntervalId = setInterval(() => {
			changeTheme();

			if (options.isDeactivated && options.setIntervalId) {
				clearInterval(options.setIntervalId);
			}
		}, 60000);

		function changeTheme() {
			if (config.get('colorTheme') !== options.themeColor) {
				if (currentHours > 13) {
					const oldThemeColor = config.get('colorTheme');
					options.oldThemeColor = oldThemeColor;
					config.update('colorTheme', options.themeColor, true);
					vscode.window.showInformationMessage('Night mode extension is activated');
				}
			}
			else {
				if (currentHours > 6) {
					if (options.oldThemeColor) {
						config.update('colorTheme', options.oldThemeColor, true);
					}
					else {
						config.update('colorTheme', null, true);
					}
				}
			}
		}
	});

	var deactivateEvent = vscode.commands.registerCommand('extension.deactivate', function () { 
		deactivate();
	});

	context.subscriptions.push(activateEvent);
	context.subscriptions.push(deactivateEvent);
}

function deactivate() {
	const config = vscode.workspace.getConfiguration('workbench');
	options.isDeactivated = true;
	options.oldThemeColor = '';
	if (options.oldThemeColor) {
		config.update('colorTheme', options.oldThemeColor, true);
	}
	else {
		config.update('colorTheme', null, true);
	}
	if (options.setIntervalId) {
		clearInterval(options.setIntervalId);
	}
	vscode.window.showInformationMessage('Night mode extension is deactivated');
}

exports.activate = activate;
