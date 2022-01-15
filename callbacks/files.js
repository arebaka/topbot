let fs     = require("fs");
let Markup = require("telegraf").Markup;

module.exports = async ctx => {
	let pid = ctx.match[1];

	try {
		let list = fs.readdirSync(`/proc/${pid}/fd`).map(fd => +fd);

		let data = [];
		let path;
		let info;
		list.sort((fd1, fd2) => fd1 - fd2);

		for (let fd of list) {
			path = fs.readlinkSync(`/proc/${pid}/fd/${fd}`);
			info = fs.readFileSync(`/proc/${pid}/fdinfo/${fd}`, "utf-8");
			info = info.replace(/[ \t]+/g, ' ');
			data.push({ fd, path, info });
		}

		let res = data.map(f => `${f.fd}: ${f.path}\n${f.info}`).join('\n');

		let markup = Markup.inlineKeyboard(
			[[Markup.button.callback("<<", `status:${pid}`)]]);

		await ctx.editMessageText(res, markup);
	}
	catch (err) {console.log(err)
		ctx.answerCbQuery("Forbidden!", true);
	}
};
