/**
 * @name ScreenShareBypass
 * @author palacee
 * @authorId 737323631117598811
 * @version 1.0
 * @description Enable high quality screen sharing without Nitro
 * @website https://github.com/palacee
 * @source https://github.com/palacee/screenshare-bypass
 * @updateUrl https://raw.githubusercontent.com/palacee/screenshare-bypass/main/ScreenShareBypass.plugin.js
 */
module.exports = (() => {
	const config = {
		info: {
			name: "ScreenShareBypass",
			authors: [
				{
					name: "palacee",
					discord_id: "737323631117598811",
					github_username: "palacee",
				},
			],
			version: "1.0",
			description:
				"Enable high quality screen sharing without Nitro; Library from other Nitro emote plugin",
			github: "https://github.com/palacee",
			github_raw:
				"https://raw.githubusercontent.com/palacee/screenshare-bypass/main/ScreenShareBypass.plugin.js",
		},
		main: "ScreenShareBypass.plugin.js",
	};

	return !global.ZeresPluginLibrary
		? class {
				constructor() {
					this._config = config;
				}
				getName() {
					return config.info.name;
				}
				getAuthor() {
					return config.info.authors.map((a) => a.name).join(", ");
				}
				getDescription() {
					return config.info.description;
				}
				getVersion() {
					return config.info.version;
				}
				load() {
					BdApi.showConfirmationModal(
						"Library Missing",
						`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
						{
							confirmText: "Download Now",
							cancelText: "Cancel",
							onConfirm: () => {
								require("request").get(
									"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
									async (error, response, body) => {
										if (error)
											return require("electron").shell.openExternal(
												"https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
											);
										await new Promise((r) =>
											require("fs").writeFile(
												require("path").join(
													BdApi.Plugins.folder,
													"0PluginLibrary.plugin.js"
												),
												body,
												r
											)
										);
									}
								);
							},
						}
					);
				}
				start() {}
				stop() {}
		  }
		: (([Plugin, Api]) => {
				const plugin = (Plugin, Api) => {
					const { Patcher, DiscordModules, Settings, PluginUtilities } = Api;
					return class ScreenShareBypass extends Plugin {
						settings = PluginUtilities.loadSettings(this.getName(), {
							size: 48,
						});

						onStart() {
							// spoof client side premium
							let tries = 1;
							let intervalId = setInterval(() => {
								if (++tries > 5) clearInterval(intervalId);

								const user =
									ZeresPluginLibrary.DiscordModules.UserStore.getCurrentUser();
								if (!user) return;
								user.premiumType = 2;
								clearInterval(intervalId);
							}, 1000);
						}

						onStop() {
							Patcher.unpatchAll();
						}
					};
				};
				return plugin(Plugin, Api);
		  })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/