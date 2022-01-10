const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.pid > p2.pid ? 1 : -1);
