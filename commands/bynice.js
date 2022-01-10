const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.nice > p2.nice ? 1 : -1);
