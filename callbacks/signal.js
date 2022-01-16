const Markup = require("telegraf").Markup;

const config = require("../config");

module.exports = async ctx => {
	if (!config.process.signals.length)
		return ctx.answerCbQuery("Forbidden!", true);

	let   markup  = [];
	const pid     = ctx.match[1];
	const buttons = config.process.signals.map(
		s => Markup.button.callback(s, `kill:${s}:${pid}`));

	for (let i = 0; i < buttons.length; i += 4) {
		markup.push(buttons.slice(i, i + 4));
	}

	markup.push([Markup.button.callback("<<", `status:${pid}`)]);
	markup = Markup.inlineKeyboard(markup);

	ctx.editMessageText(`Select the signal for ${pid}`, markup);
};
