const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.priority > p2.priority ? 1 : -1);
