const vscode = require('vscode');
const nightModeConfig = vscode.workspace.getConfiguration('nightMode'); // My extension config

// Default options
const options = {
	colorTheme: nightModeConfig.colorTheme || 'Default High Contrast',
	isDeactivated: false,
	isActivated: false,
	sunRise: 6,
	sunSet: 18,
	msg: 'Night mode is activated 👍',
	oldColorTheme: '',
	setIntervalId: null
};

if (nightModeConfig.colorTheme) {
	options.colorTheme = nightModeConfig.colorTheme;
}

if (nightModeConfig.sunRise) {
	options.sunRise = nightModeConfig.sunRise;
}

if (nightModeConfig.sunSet) {
	options.sunSet = nightModeConfig.sunSet;
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
			const oldColorTheme = config.get('colorTheme');
			if (currentHours >= options.sunSet && !options.isActivated && oldColorTheme !== options.colorTheme) {
				if (oldColorTheme) options.oldColorTheme = oldColorTheme;
				options.msg = `Activated ${options.colorTheme} theme`;
				options.isActivated = true;
				config.update('colorTheme', options.colorTheme, true);
			}
			else if (options.isActivated && currentHours >= options.sunRise && currentHours < options.sunSet) {
				if (options.oldColorTheme) {
					config.update('colorTheme', options.oldColorTheme, true);
					options.msg = 'Changed back to your custom theme';
				}
				else {
					config.update('colorTheme', undefined, true);
					options.msg = 'Changed back to default theme';
				}
				options.isActivated = false;
			}

			options.isDeactivated = false;
			
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
			var oldColorTheme = config.get('colorTheme');
			if (oldColorTheme) {
				oldColorTheme = oldColorTheme;
			}
			else {
				oldColorTheme = undefined;
			}
			config.update('colorTheme', oldColorTheme, true);
		}
		else {
			config.update('colorTheme', options.oldColorTheme, true);
		}

		if (options.setIntervalId) {
			clearInterval(options.setIntervalId);
		}

		options.isDeactivated = true;
		options.isActivated = false;
		
		var msgDisposable = vscode.window.setStatusBarMessage('Night mode is deactivated');
		
		setTimeout(function() {
			msgDisposable.dispose();
		}, 4000);
	}
}

exports.activate = activate;
