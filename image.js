const path      = require("path");
const os        = require("os");
const si        = require("systeminformation");
const puppeteer = require("puppeteer");

const { durationFormatter, sizeFormatter } = require("human-readable");

const config = require("./config");

let browser;
let page;

async function prepare()
{
	browser = await puppeteer.launch();
	page    = await browser.newPage();

	await page.exposeFunction("formatDur", durationFormatter());
	await page.exposeFunction("formatSize", sizeFormatter({ std: "IEC" }));
}

const promise = prepare();

module.exports = async () => {
	await promise;
	await page.goto(`file://${path.resolve("./views/" + config.image.sample)}`);

	let data = {};

	data.user    = os.userInfo();
	data.loadavg = os.loadavg();
	data.env     = process.env;

	data.graphics    = await si.graphics();
	data.os          = await si.osInfo();
	data.system      = await si.system();
	data.cpu         = await si.cpu();
	data.time        = await si.time();
	data.mem         = await si.mem();
	data.currentLoad = await si.currentLoad();
	data.temp        = await si.cpuTemperature();
	data.fsSize      = await si.fsSize();

	await page.evaluate(data => render(data), data);

	const container = await page.$(config.image.select);

	return await container.screenshot({ type: "jpeg", quality: 100 });
};
