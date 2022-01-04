const Telegraf = require("telegraf").Telegraf;

const config = require("./config");
const logger = require("./logger");

const middlewares = require("./middlewares");
const commands    = require("./commands");
const handlers    = require("./handlers");
const callbacks   = require("./callbacks");




module.exports = class Bot
{
	constructor(token)
	{
		this.token    = token;
		this.username = null;
		this.bot      = new Telegraf(this.token);

	//	this.bot.start(commands.start);

	//	for (let command of ["info", "tree", "bypid", "byuser", "bypri", "bynice", "bystate", "bycpu", "bymem", "bytime", "bycmd"]) {
	//		this.bot.command(command, commands[command]);
	//	}

		this.bot.on("inline_query", handlers.inline);
	}

	async start()
	{
		this.bot
			.launch(config.params)
			.then(res => {
				this.username = this.bot.botInfo.username;
				logger.info(`Bot @${this.username} started.`);
			})
			.catch(err => {
				logger.fatal(err);
				process.exit(1);
			});
	}

	async stop()
	{
		logger.info(`Stop the bot @${this.username}`);

		await this.bot.stop();

		process.exit(0);
	}

	async reload()
	{
		logger.info(`Reload the bot @${this.username}`);

		await this.bot.stop();
		await this.start();
	}
}
