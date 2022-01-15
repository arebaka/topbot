const status = require("../status");

module.exports = async ctx => {
	const res = await status(ctx.match[1]);
	if (!res) return ctx.editMessageText("The process is no more!");
	ctx.editMessageText(res[0], res[1], ...res);
};
