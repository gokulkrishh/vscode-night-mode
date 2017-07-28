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

		changeTheme(); //Change theme while activating the ext

		options.setIntervalId = setInterval(() => {
			changeTheme();
			if (options.isDeactivated && options.setIntervalId) {
				clearInterval(options.setIntervalId);
			}
		}, 60000);

		function changeTheme() {
			if (config.get('colorTheme') !== options.themeColor) {
				if (currentHours > 18 && currentHours < 6) {
					const oldThemeColor = config.get('colorTheme');
					options.oldThemeColor = oldThemeColor;
					config.update('colorTheme', options.themeColor, true);
					var msgDisposable = vscode.window.setStatusBarMessage('Night mode extension is activated');
					setTimeout(function() {
						msgDisposable.dispose();
					}, 4000);
				}
			}
			else {
				if (currentHours > 6 && currentHours < 18) {
					if (options.oldThemeColor) {
						config.update('colorTheme', options.oldThemeColor, true);
					}
					else {
						config.update('colorTheme', '', true);
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
	var msgDisposable = vscode.window.setStatusBarMessage('Night mode extension is deactivated');
	setTimeout(function() {
		msgDisposable.dispose();
	}, 4000);
}

exports.activate = activate;
