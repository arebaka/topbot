const si = require("systeminformation");

const config = require("./config");

module.exports = async () => {
	let data = await si.processes();

	data = data.list;
	data = data.filter(p => p.memVsz);
	data = data.filter(p => p.parentPid != process.pid);
	data = data.filter(p => data.find(parent => parent.pid == p.parentPid || !p.parentPid));

	return data;
};
