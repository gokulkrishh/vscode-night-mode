### <p align="center"><img width="150px" height="150px" src="https://raw.githubusercontent.com/gokulkrishh/vscode-night-mode/master/images/vscode-night-mode.png"></p>

# vscode-night-mode

An extension to automatically change current theme to `custom theme` at `night (>= 6PM)`, and `switch back` to `previous theme` in the `morning (>= 6AM)`.

## Quick Start

- Install the extension with below using <kbd>⌘</kbd> + <kbd>p</kbd> or search for `vscode-night-mode` and install.

```bash
ext install vscode-night-mode
```

## Before Activating Extension

In your `workspace.json` or `settings.json`, give your choice of theme name to change.

```json
{
	"nightMode.colorTheme": "Monokai", // Default - Default High Contrast
	"nightMode.sunRise": "5", // Morning 5 AM - Default 6 AM
	"nightMode.sunSet": "19" // Evening 7PM - Default 6 PM
}
```

## Activate or Switch back to your previous theme

- Shortcut - <kbd>cmd</kbd> or <kbd>ctrl</kbd> + <kbd>.</kbd>

### <p align="center"><img src="https://raw.githubusercontent.com/gokulkrishh/vscode-night-mode/master/images/vscode-activated.png"></p>

## Deactivate the extension

- Shortcut - <kbd>cmd</kbd> or <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>.</kbd>

### <p align="center"><img src="https://raw.githubusercontent.com/gokulkrishh/vscode-night-mode/master/images/vscode-deactivated.png"></p>

#### Contributions

If you find a bug or want to a new feature, please file an issue. PR's are most welcome ;)

#### License

MIT © Gokulakrishnan
