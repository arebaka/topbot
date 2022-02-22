const status = require("../status");

module.exports = async ctx => {
	if (ctx.match[2] && ctx.match[2] != "@" + ctx.me) return;

	const res = await status(ctx.match[1]);
	if (!res) return ctx.replyWithMarkdown("No such process!");
	ctx.reply(res.text, res.extra);
};
