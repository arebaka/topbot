const fs     = require("fs");
const os     = require("os");
const printf = require("printf");
const Markup = require("telegraf").Markup;

const config    = require("./config");
const processes = require("./processes");

module.exports = async pid => {
	const data    = await processes();
	const process = data.find(p => p.pid == pid);

	if (!process) return null;

	let fullCmd = process.path || "";
	fullCmd += process.path && process.path != "/" ? "/" : "";
	fullCmd += process.command;
	fullCmd += process.params ? " " + process.params : "";

	let text =
`<pre>${fullCmd}</pre>

<code>by </code>${process.user}
<code>at </code>${process.started}
${process.tty ? "<code>on </code>" + process.tty + "\n" : ""}`;

	for (let file of ["cwd", "exe", "root"]) {
		let link;

		try {
			link = fs.readlinkSync(`/proc/${process.pid}/${file}`);
			text += `\n<code>${file.padEnd(5)}</code><u>${link}</u>`;
		}
		catch (err) {}
	}

	try {
		let content = fs.readFileSync(`/proc/${process.pid}/status`, "utf-8");
		let key;
		let value;
		text += '\n';

		for (let line of content.split('\n')) {
			if (!line) continue;
			[ key, value ] = line.split(/:\s+/);
			text += `\n<b>${key}</b>: ${value}`;
		}
	}
	catch (err) {}

	if (process.user != os.userInfo().username)
		return [text, { parse_mode: "HTML" }];

	let markup = [["files", "env", "io", "limits"]
		.map(a => Markup.button.callback(a, `${a}:${process.pid}`))];
	config.process.management.length && markup.push(config.process.management
		.map(a => Markup.button.callback(a, `${a}:${process.pid}`)));
	markup = Markup.inlineKeyboard(markup);

	return [text, markup, { parse_mode: "HTML" }];
};
