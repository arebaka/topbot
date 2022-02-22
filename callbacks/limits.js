const fs     = require("fs");
const Markup = require("telegraf").Markup;

module.exports = async ctx => {
	let pid = ctx.match[1];

	try {
		let res = fs.readFileSync(`/proc/${pid}/limits`, "utf-8");

		let markup = Markup.inlineKeyboard(
			[[Markup.button.callback("<<", `status:${pid}`)]]);

		await ctx.editMessageText(`<pre>${res}</pre>`,
			{ reply_markup: markup.reply_markup, parse_mode: "HTML" });
	}
	catch (err) {
		ctx.answerCbQuery("Forbidden!", true);
	}
};
