const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.command > p2.command ? 1 : -1);
