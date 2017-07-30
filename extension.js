const vscode = require('vscode');
const nightModeConfig = vscode.workspace.getConfiguration('vscodeNightMode'); // My extension config

// Default options
const options = {
	colorTheme: 'Default High Contrast',
	isDeactivated: false,
	msg: 'Night mode 👍',
	oldColorTheme: '',
	setIntervalId: null
};

if (nightModeConfig.colorTheme) {
	options.colorTheme = nightModeConfig.colorTheme;
}

function activate(context) {
	var activateEvent = vscode.commands.registerCommand('extension.activate', function () {
		const config = vscode.workspace.getConfiguration('workbench');
		
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
			if (config.get('colorTheme') !== options.colorTheme) {
				if (currentHours >= 18) {
					const oldColorTheme = config.get('colorTheme');
					if (oldColorTheme) options.oldColorTheme = oldColorTheme;
					options.msg = `Activated ${options.colorTheme} theme`;
					config.update('colorTheme', options.colorTheme, true);
				}
			}
			else {
				if (currentHours >= 6 && currentHours < 18) {
					config.update('colorTheme', options.oldColorTheme, true);
				}
				else {
					config.update('colorTheme', undefined, true);
				}
				options.msg = 'Changed back to your default theme';
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
		if (!options.oldColorTheme) {
			config.update('colorTheme', undefined, true);
		}
		else {
			config.update('colorTheme', options.oldColorTheme, true);
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
