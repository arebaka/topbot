const path = require("path");
const fs   = require("fs");
const toml = require("toml");

const config = toml.parse(fs.readFileSync(path.resolve("config.toml")));




module.exports = {
	token:   process.env.TOKEN || config.bot.token,
	adminId: process.env.ADMIN_ID || config.bot.admin_id,
	params:  config.params,

	image: {
		sample: config.image.sample,
		select: config.image.select
	}
};
