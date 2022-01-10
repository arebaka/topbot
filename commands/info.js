const path = require("path");
const fs   = require("fs");

const config = require("../config");
const logger = require("../logger");
const image  = require("../image");

module.exports = async ctx => {
	ctx.replyWithChatAction("upload_photo");

	const photo = await image();
	fs.writeFileSync(path.resolve("../image.jpg"), photo);

	ctx.replyWithPhoto({ source: path.resolve("../image.jpg" )});
};
