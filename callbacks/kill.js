const config = require("../config");

const status = require("./status");

module.exports = async ctx => {
	const signal = ctx.match[1];
	const pid    = ctx.match[2];

	try {
		if (!config.process.signals.includes(signal))
			throw 1;
		process.kill(pid, signal);

		await status(ctx);
	}
	catch (err) {
		ctx.answerCbQuery("Forbidden!", true);
	}
};
