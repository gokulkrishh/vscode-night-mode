var vscode = require('vscode');

// Default options
const options = {
	isDeactivated: false,
	setIntervalId: null,
	oldThemeColor: '',
	msg: 'Night mode extension is activated 👍',
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
				if (currentHours >= 18) {
					const oldThemeColor = config.get('colorTheme');
					if (oldThemeColor) options.oldThemeColor = oldThemeColor;
					options.msg = 'Activated contrast theme';
					config.update('colorTheme', options.themeColor, true);
				}
			}
			else {
				if (currentHours >= 6 && currentHours <= 18) {
					config.update('colorTheme', options.oldThemeColor, true);
					options.msg = 'Changed back to your default theme';
				}
			}

			var msgDisposable = vscode.window.setStatusBarMessage(options.msg);
			
			setTimeout(() => {
				msgDisposable.dispose();
			}, 4000);
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
	if (!options.isDeactivated) {
		if (!options.oldThemeColor) {
			config.update('colorTheme', undefined, true);
		}
		else {
			config.update('colorTheme', options.oldThemeColor, true);
		}
		if (options.setIntervalId) {
			clearInterval(options.setIntervalId);
		}
		var msgDisposable = vscode.window.setStatusBarMessage('Night mode is deactivated');
		setTimeout(function() {
			msgDisposable.dispose();
		}, 4000);
	}
}

exports.activate = activate;
