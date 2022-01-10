const printf = require("printf");

const config    = require("./config");
const logger    = require("./logger");
const processes = require("./processes");

function formatUptime(msecs)
{
	let secs = Math.round(msecs / 1000);
	let days = Math.floor(secs / (3600 * 24));
	secs %= (3600 * 24);
	let hours = Math.floor(secs / 3600);
	secs %= 3600;
	let mins = Math.floor(secs / 60);
	secs %= 60;

	let res = days ? `${days},` : "";
	res += hours ? `${hours}:`.padStart(3, '0') : res ? "00:" : "";
	res += mins ? `${mins}:`.padStart(2, '0') : "00:";
	res += secs ? `${secs}`.padStart(2, '0') : "00";

	return res;
}

module.exports = async (ctx, comp) => {
	let data = await processes();
	let str;
	let res  = printf("%7s %-10s %c %3s %4s %6s %6s %12s %s\n",
		"PID", "USER", "STATE"[0], "PRI", "NICE", "CPU%", "MEM%", "UPTIME", "COMMAND");

	data.sort(comp);

	for (let process of data) {
		str = printf("%7s %-10s %c %3d %4d % 6.1f % 6.1f %12s %s\n",
			process.pid, process.user, process.state[0],
			process.priority, process.nice, process.cpu, process.mem,
			formatUptime(new Date() - new Date(process.started)),
			process.command);

		if (res.length + str.length > 4096) {
			await ctx.replyWithHTML(`<pre>${res}</pre>`);
			res = "";
		}

		res += str;
	}

	await ctx.replyWithHTML(`<pre>${res}</pre>`);

	data.sort((p1, p2) => p1.pid > p2.pid ? 1 : -1);
	ctx.replyWithMarkdown(data.map(p => printf("%8s", "/" + p.pid)).join(' '));
};
