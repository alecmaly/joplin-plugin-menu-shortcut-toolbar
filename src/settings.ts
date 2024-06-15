import joplin from "api";
import { SettingItemType } from "api/types";
import { 
	actions, DTI_SETTINGS_PREFIX, ACTIVATE_ONLY_SETTING, ENABLE_JOIN_LINES, ENABLE_TOGGLE_OVERWRITE, 
	NUM_CUSTOM_WRAP_FIELDS, NUM_CUSTOM_REPLACE_FIELDS
} from "./common";

export namespace settings {
	const SECTION = 'MenuShortcutToolbarSettings';

	export async function register() {
		await joplin.settings.registerSection(SECTION, {
			label: "Menu items, shortcuts, toolbar icons",
			iconName: "fas fa-tools",
		});

		let PLUGIN_SETTINGS = {};

		PLUGIN_SETTINGS[ACTIVATE_ONLY_SETTING] = {
			value: false,
			public: true,
			section: SECTION,
			type: SettingItemType.Bool,
			label: 'Only activate, if enabled in Markdown Plugin settings',
			description: "Only activate menu items, shortcuts, and toolbar icons for markdown plugins which are enabled in Joplin's settings. (requires restart)",
		}

		PLUGIN_SETTINGS[ENABLE_JOIN_LINES] = {
			value: true,
			public: true,
			section: SECTION,
			type: SettingItemType.Bool,
			label: 'Enable "join lines" in editor',
			description: "The markdown editor (CodeMirror) provides a function to join lines. This option enables it. (requires restart)",
		}

		PLUGIN_SETTINGS[ENABLE_TOGGLE_OVERWRITE] = {
			value: false,
			public: true,
			section: SECTION,
			type: SettingItemType.Bool,
			label: 'Enable "toggle overwrite mode" in editor',
			description: "The markdown editor (CodeMirror) provides a function to toggle overwrite mode. This option enables it. (requires restart)",
		}

		for (const actionName in actions) {
			const action = actions[actionName];
			var setting = DTI_SETTINGS_PREFIX + actionName;

			PLUGIN_SETTINGS[setting] = {
				value: false,
				public: true,
				section: SECTION,
				advanced: true,
				type: SettingItemType.Bool,
				label: 'Remove toolbar icon for ' + action.stringPrefix + action.label + action.stringPostfix + ' (requires restart)',
			}
		}

		PLUGIN_SETTINGS[NUM_CUSTOM_WRAP_FIELDS] = {
			value: 2,
			public: true,
			section: SECTION,
			type: SettingItemType.Int,
			label: 'Number of custom wrap fields (requires restart)',
			minimum: 0,
			maximum: 9
		}

		PLUGIN_SETTINGS[NUM_CUSTOM_REPLACE_FIELDS] = {
			value: 1,
			public: true,
			section: SECTION,
			type: SettingItemType.Int,
			label: 'Number of custom replace fields (requires restart)',
			minimum: 0,
			maximum: 9
		}
		await joplin.settings.registerSettings(PLUGIN_SETTINGS);


		// register dynamic fields
		PLUGIN_SETTINGS = {};

		// register custom wrap settings
		const num_custom_wrap_fields = (await joplin.settings.value(NUM_CUSTOM_WRAP_FIELDS) as number)
		console.log(num_custom_wrap_fields)
		for (let i = 1; i <= num_custom_wrap_fields; i++) {
			let setting = `customfieldwrap${i}`

			// register prefix
			PLUGIN_SETTINGS[setting + '-prefix'] = {
				value: i == 1 ? '<span style="color: red">' : '',  // default first item
				public: true,
				section: SECTION,
				advanced: false,
				type: SettingItemType.String,
				label: `CustomWrap${i} Prefix`
			}

			// register postfix
			PLUGIN_SETTINGS[setting + '-postfix'] = {
				value: i == 1 ? '</span>' : '',  // default first item
				public: true,
				section: SECTION,
				advanced: false,
				type: SettingItemType.String,
				label: `CustomWrap${i} Postfix`
			}
		}

		// register custom replace settings
		const num_custom_replace_fields = (await joplin.settings.value(NUM_CUSTOM_REPLACE_FIELDS) as number)
		for (let i = 1; i <= num_custom_replace_fields; i++) {
			let setting = `customfieldreplace${i}`

			// register prefix
			PLUGIN_SETTINGS[setting + '-searchstr'] = {
				value: i == 1 ? '^\s*' : '',  // default first item
				public: true,
				section: SECTION,
				advanced: false,
				type: SettingItemType.String,
				label: `CustomReplace${i} SearchStr`
			}

			// register postfix
			PLUGIN_SETTINGS[setting + '-replacestr'] = {
				value: i == 1 ? '<match> - ' : '',  // default first item
				public: true,
				section: SECTION,
				advanced: false,
				type: SettingItemType.String,
				label: `CustomReplace${i} ReplaceStr`
			}

			PLUGIN_SETTINGS[setting + '-regexFlags'] = {
				value: i == 1 ? 'gm' : 'g',  // default first item
				public: true,
				section: SECTION,
				advanced: false,
				type: SettingItemType.String,
				label: `CustomReplace${i} regexFlags`
			}
		}

		await joplin.settings.registerSettings(PLUGIN_SETTINGS);
	}
}
