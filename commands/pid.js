const status = require("../status");

module.exports = async ctx => {
	const res = await status(ctx.match[1]);
	if (!res) return ctx.replyWithMarkdown("No such process!");
	ctx.reply(res.text, res.extra);
};
