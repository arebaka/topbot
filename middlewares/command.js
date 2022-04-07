module.exports = (ctx, next) => {
	ctx.state.log = `"${ctx.message.text}"`;
	next();
};
