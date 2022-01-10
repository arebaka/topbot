const top = require("../top");

module.exports = async ctx =>
	await top(ctx, (p1, p2) => p1.mem < p2.mem ? 1 : -1);
