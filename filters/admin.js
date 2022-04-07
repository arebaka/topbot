const config = require("../config");
const logger = require("../logger");

module.exports = ctx => {
	if (config.bot.admins.includes(ctx.from.id))
		return true;
	else {
		ctx.state.log && logger.warn(ctx.state.log);
		return false;
	}
};
