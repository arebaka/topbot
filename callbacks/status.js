const status = require("../status");
const logger = require("../logger");

module.exports = async ctx => {
	const res = await status(ctx.match[1]);
	if (!res) return ctx.editMessageText("The process is no more!");
	ctx.editMessageText(res.text, res.extra);
};
