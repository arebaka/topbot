const logger = require("../logger");

module.exports = async (ctx, next) => {
	ctx.state.log && logger.info(ctx.state.log);
	next();
}
