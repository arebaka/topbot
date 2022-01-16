const path = require("path");
const fs   = require("fs");
const toml = require("toml");

const config = toml.parse(fs.readFileSync(path.resolve("config.toml")));

module.exports = {
	bot: {
		token:  process.env.TOKEN || config.bot.token,
		admins: process.env.ADMINS.split(/\s/g) || config.bot.admins,
		params: config.bot.params
	},

	process: {
		signals: config.process.signals || []
	},

	image: {
		sample: config.image.sample,
		select: config.image.select
	}
};
