const fs     = require("fs");
const printf = require("printf");

const config    = require("../config");
const logger    = require("../logger");
const processes = require("../processes");

module.exports = async ctx => {
	const pid     = ctx.match[1];
	const data    = await processes();
	const process = data.find(p => p.pid == pid);

	if (!process)
		return ctx.replyWithMarkdown("No such process!");

	let fullCmd = process.path || "";
	fullCmd += process.path && process.path != "/" ? "/" : "";
	fullCmd += process.command;
	fullCmd += process.params ? " " + process.params : "";

	let res =
`<pre>${fullCmd}</pre>

<code>by </code>${process.user}
<code>at </code>${process.started}
${process.tty ? "<code>on </code>" + process.tty + "\n" : ""}`;

	for (let file of ["cwd", "exe", "root"]) {
		let link;

		try {
			link = fs.readlinkSync(`/proc/${process.pid}/${file}`);
			res += `\n<code>${file.padEnd(5)}</code><u>${link}</u>`;
		}
		catch (err) {}
	}

	try {
		let content = fs.readFileSync(`/proc/${process.pid}/status`, "utf-8");
		let key;
		let value;
		res += '\n';

		for (let line of content.split('\n')) {
			if (!line) continue;
			[ key, value ] = line.split(/:\s+/);
			res += `\n<b>${key}</b>: ${value}`;
		}
	}
	catch (err) {}

	ctx.replyWithHTML(res);
};
