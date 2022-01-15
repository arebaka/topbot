const path   = require("path");
const fs     = require("fs");
const uuidv4 = require("uuid").v4;

const config = require("../config");
const logger = require("../logger");
const image  = require("../image");

module.exports = async ctx => {
	const photo = await image();
	fs.writeFileSync(path.resolve("../image.jpg"), photo);

	const mess = await ctx.tg.sendPhoto(
		config.bot.admins[0], { source: path.resolve("../image.jpg" )});
	ctx.tg.deleteMessage(config.bot.admins[0], mess.message_id);

	try {
		ctx.answerInlineQuery([{
			type: "photo",
			id:   uuidv4(),

			photo_file_id: mess.photo[0].file_id
		}], {
			is_personal: true,
			cache_time:  0
		});
	}
	catch (err) {
		logger.error(err);
	}
};
