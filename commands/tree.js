const printf = require("printf");

const config    = require("../config");
const logger    = require("../logger");
const processes = require("../processes");
const states    = require("../states");

class Node
{
	constructor(process) {
		Object.assign(this, process);
	}

	setChildren(data) {
		this.children = data.filter(p => p.parentPid == this.pid);
	}

	show(depth, levels, format) {
		let prefix = "";
		for (let i = 0; i < depth - 1; i++) {
			prefix += levels[i] ? "│ " : "  ";
		}
		if (depth > 0) {
			prefix += levels[depth - 1] ? "├─" : "└─";
		}

		let res = printf(
			format,
			this.pid, this.user.substr(0, 10), states[this.state],
			this.cpu, this.mem, prefix + this.command);

		levels[depth] = true;
		for (let [ i, child ] of this.children.entries()) {
			if (i + 1 == this.children.length) {
				levels[depth] = false;
			}
			res += child.show(depth + 1, levels, format);
		}

		return res;
	};
}

module.exports = async ctx => {
	let data   = await processes();
	let pidLen = Math.max.apply(null, data.map(p => p.pid.toString().length));
	let res    = printf(
		`%${Math.max(pidLen, 3)}s %-10s %c %6s %6s %s\n`,
		"PID", "USER", "S", "CPU%", "MEM%", "COMMAND");

	data.sort((p1, p2) => p1.pid > p2.pid ? 1 : -1);
	data = data.map(p => new Node(p));
	for (let process of data) {
		process.setChildren(data);
	}

	res += data[0].show(0, [], `%${Math.max(pidLen, 3)}s %-10s %c % 6.1f % 6.1f %s\n`);

	while(res.length) {
		let offset = res.substr(0, 4096).lastIndexOf('\n');
		offset = offset < 0 ? res.length : offset;
		await ctx.replyWithHTML(`<pre>${res.substr(0, offset)}</pre>`);
		res = res.substr(offset + 1, res.length);
	}

	ctx.replyWithMarkdown(data.map(p => printf(`%-${pidLen + 1}s`, "/" + p.pid)).join(' '));
};
