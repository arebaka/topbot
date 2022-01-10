const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.started > p2.started ? 1 : -1);
