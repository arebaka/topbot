const printf = require("printf");

const config    = require("./config");
const logger    = require("./logger");
const processes = require("./processes");
const states    = require("./states");

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
	res += mins ? `${mins}:`.padStart(3, '0') : "00:";
	res += secs ? `${secs}`.padStart(2, '0') : "00";

	return res;
}

module.exports = async (ctx, comp) => {
	let data = await processes();
	data.sort(comp);
	data.forEach(p => p.uptime = formatUptime(new Date() - new Date(p.started)));

	let str;
	let pidLen    = Math.max.apply(null, data.map(p => p.pid.toString().length));
	let uptimeLen = Math.max.apply(null, data.map(p => p.uptime.length));
	let res       = printf(
		`%${Math.max(pidLen, 3)}s %${Math.max(pidLen, 4)}s %-10s %c %3s %3s %6s %6s %${Math.max(uptimeLen, 6)}s %s\n`,
		"PID", "PPID", "USER", "S", "PRI", "NI", "CPU%", "MEM%", "UPTIME", "COMMAND");

	for (let process of data) {
		str = printf(
			`%${Math.max(pidLen, 3)}s %${Math.max(pidLen, 4)}s %-10s %c %3d %3d % 6.1f % 6.1f %${Math.max(uptimeLen, 6)}s %s\n`,
			process.pid, process.parentPid, process.user.substr(0, 10),
			states[process.state], process.priority, process.nice,
			process.cpu, process.mem, process.uptime, process.command);

		if (res.length + str.length > 4096) {
			await ctx.replyWithHTML(`<pre>${res}</pre>`);
			res = "";
		}

		res += str;
	}

	await ctx.replyWithHTML(`<pre>${res}</pre>`);

	data.sort((p1, p2) => p1.pid > p2.pid ? 1 : -1);
	ctx.replyWithMarkdown(data.map(p => printf(`%-${pidLen + 1}s`, "/" + p.pid)).join(' '));
};
