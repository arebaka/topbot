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
		try {
			const link = fs.readlinkSync(`/proc/${process.pid}/${file}`);
			text += `\n<code>${file.padEnd(5)}</code><u>${link}</u>`;
		}
		catch (err) {}
	}

	try {
		let content = fs.readFileSync(`/proc/${process.pid}/status`, "utf-8");
		text += '\n';

		for (let line of content.split('\n')) {
			if (!line) continue;
			const [ key, value ] = line.split(/:\s+/);
			text += `\n<b>${key}</b>: ${value}`;
		}
	}
	catch (err) {}

	if (process.user != os.userInfo().username)
		return { text, extra: { parse_mode: "HTML" } };

	let markup = [["files", "env", "io", "limits"]
		.map(a => Markup.button.callback(a, `${a}:${process.pid}`))];

	if (config.process.signals.length) {
		let buttons = [Markup.button.callback("signal", `signal:${process.pid}`)];
		config.process.signals.includes("SIGTERM") && buttons.unshift(
			Markup.button.callback("kill", `kill:SIGTERM:${process.pid}`));
		markup.push(buttons);
	}

	markup = Markup.inlineKeyboard(markup);

	return { text, extra: {
		reply_markup: markup.reply_markup, parse_mode: "HTML" } };
};
