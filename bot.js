const Telegraf = require("telegraf").Telegraf;
const Composer = require("telegraf").Composer;

const config = require("./config");
const logger = require("./logger");

const middlewares = require("./middlewares");
const commands    = require("./commands");
const handlers    = require("./handlers");
const callbacks   = require("./callbacks");
const filters     = require("./filters");

module.exports = class Bot
{
	constructor(token)
	{
		this.token    = token;
		this.username = null;
		this.bot      = new Telegraf(this.token);

		this.bot.use(Composer.filter(
			ctx => ctx.update.inline_query
				|| ctx.update.callback_query
				|| (ctx.message && ctx.message.text)
		));

		this.bot.start(
			middlewares.command,
			filters.admin,
			middlewares.log,
			commands.start
		);

		for (let command of [
			"info", "tree", "bypid", "byuser",
			"bypri", "bynice", "bystate",
			"bycpu", "bymem", "bytime", "bycmd"
		]) {
			this.bot.command(command,
				middlewares.command,
				filters.admin,
				middlewares.log, 
				commands[command]
			);
		}

		this.bot.hears(/^\/(\d+)(@[_a-zA-Z0-9]+)?$/,
			middlewares.command,
			filters.admin,
			middlewares.log,
			commands.pid
		);

		this.bot.on("inline_query",
			(ctx, next) => {
				ctx.state.log = "inline";
				next();
			},
			filters.admin,
			middlewares.log,
			handlers.inline
		);

		this.bot.on("callback_query",
			(ctx, next) => {
				ctx.state.log = `callback: "${ctx.update.callback_query.data}"`;
				next();
			},
			filters.admin,
			middlewares.log
		);

		this.bot.action(/^status:(\d+)$/, callbacks.status);
		this.bot.action(/^signal:(\d+)$/, callbacks.signal);

		this.bot.action(/^files:(\d+)$/,  callbacks.files);
		this.bot.action(/^env:(\d+)$/,    callbacks.env);
		this.bot.action(/^io:(\d+)$/,     callbacks.io);
		this.bot.action(/^limits:(\d+)$/, callbacks.limits);

		this.bot.action(/^kill:([^:]+):(\d+)$/, callbacks.kill);
	}

	async start()
	{
		this.bot
			.launch(config.bot.params)
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
