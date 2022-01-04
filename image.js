const path      = require("path");
const os        = require("os");
const si        = require("systeminformation");
const puppeteer = require("puppeteer");

const { durationFormatter, sizeFormatter } = require("human-readable");

const config = require("./config");

const browser = puppeteer.launch();

module.exports = async () => {
	const page = await (await browser).newPage();
	await page.goto(`file://${path.resolve("./views/" + config.image.sample)}`);

	let data     = await si.getAllData();
	data.user    = os.userInfo();
	data.loadavg = os.loadavg();
	data.env     = process.env;

	await page.exposeFunction("formatDur", durationFormatter());
	await page.exposeFunction("formatSize", sizeFormatter({ std: "IEC" }));

	await page.evaluate(data => render(data), data);

	const container = await page.$(config.image.select);

	return await container.screenshot({ type: "jpeg", quality: 100 });
};
