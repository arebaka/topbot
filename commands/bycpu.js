const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.cpu < p2.cpu ? 1 : -1);
