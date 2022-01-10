const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.state > p2.state ? 1 : -1);
