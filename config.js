const path = require("path");
const fs   = require("fs");
const toml = require("toml");

let config = toml.parse(fs.readFileSync(path.resolve("config.toml")));

config.bot.token  = process.env.TOKEN || config.bot.token;

config.bot.admins = process.env.ADMINS
	? process.env.ADMINS.split(/\s/g).map(id => +id)
	: config.bot.admins;

module.exports = config;
