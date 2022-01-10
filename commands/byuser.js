const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.user > p2.user ? 1 : -1);
