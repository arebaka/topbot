const { Telegraf, Composer } = require("telegraf");

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

		this.bot.use(Composer.filter(
			ctx => ctx.update.inline_query
				|| ctx.update.callback_query
				|| (ctx.message && ctx.message.text)),
			(ctx, next) => {
				let log = (ctx.update.inline_query && "inline")
					|| (ctx.update.callback_query && `callback: "${ctx.update.callback_query.data}"`)
					|| (ctx.message && ctx.message.text && `"${ctx.message.text}"`);

				if ((ctx.update.inline_query
						|| ctx.update.callback_query
						|| ctx.chat.type == "private"
					) && !config.bot.admins.find(id => id == ctx.from.id)
				)
					return logger.warn(log);

				logger.info(log);

				return next();
			});

		this.bot.start(commands.start);

		for (let command of [
			"info", "tree", "bypid", "byuser",
			"bypri", "bynice", "bystate",
			"bycpu", "bymem", "bytime", "bycmd"
		]) {
			this.bot.command(command, commands[command]);
		}

		this.bot.hears(/^\/(\d+)$/, commands.pid);

		this.bot.on("inline_query", handlers.inline);

		this.bot.action(/^status:(\d+)$/, callbacks.status);

		this.bot.action(/^files:(\d+)$/,  callbacks.files);
		this.bot.action(/^env:(\d+)$/,    callbacks.env);
		this.bot.action(/^io:(\d+)$/,     callbacks.io);
		this.bot.action(/^limits:(\d+)$/, callbacks.limits);

		this.bot.action(/^kill:(\d+)$/,      callbacks.kill);
		this.bot.action(/^termitane:(\d+)$/, callbacks.terminate);
		this.bot.action(/^signal:(\d+)$/,    callbacks.signal);

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
