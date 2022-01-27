# topbot
*Why are you installing Arch Linux when you can just edit source of the neofetch?*

> A bot for those who wanna boast of their Arch Linux in the [Telegram](https://telegram.org), but are too lazy to run neofetch.

![](https://img.shields.io/tokei/lines/github/arebaka/topbot)
![](https://img.shields.io/github/repo-size/arebaka/topbot)
![](https://img.shields.io/npm/v/topbot)
![](https://img.shields.io/codefactor/grade/github/arebaka/topbot)

![](https://img.shields.io/badge/English-100%25-brightgreen)

## Commands
`/info` – get a dashboard with general stat of the system  
`/tree` – get running processes in tree view (parents & children)  
`/bypid [filter]` – get a list of running processes sorted by their PID  
`/byuser [filter]` – get a list of running processes sorted by their user  
`/bypri [filter]` – get a list of running processes sorted by their priority  
`/bynice [filter]` – get a list of running processes sorted by their nice  
`/bystate [filter]` – get a list of running processes sorted by their state  
`/bycpu [filter]` – get a list of running processes sorted by their CPU usage  
`/bymem [filter]` – get a list of running processes sorted by their memory usage  
`/bytime [filter]` – get a list of running processes sorted by their uptime  
`/bycmd [filter]` – get a list of running processes sorted by their command  
`/<PID>` – get stat of the process with PID

## Usage
1. Create and setup a bot via [@BotFather](https://t.me/BotFather)
2. Install [npm](https://www.npmjs.com) & [node.js](https://npmjs.com/package/node)
3. `npm i topbot`
4. `export TOKEN=<TOKEN_FROM_BOTFATHER>`
5. `export ADMINS='<IDS OF USERS WHO CAN USE THE BOT SEPARATED BY SPACE>'`
6. `npx topbot`
7. Now the `$ADMINS` can use the bot everywhere (commands, inline, buttons)
8. To stop the bot, type `stop` to console with it and press enter

**WARNING!** Start your bot in PM before using the inline!

## Settings
A file `config.toml` contains:

`[bot]` – parameters for the launch of the bot that could be used instead the variables of environment  
`[image]` – a filename from `./views` with a page and a selector of an element on it to render the general dashboard  
`[process]` – currently contains a list of signals that can be sended to processes using buttons

To render the dashboard, the page from `./views` must contain a function `render(data)` that takes an object with information returning by [systeminformation](https://www.npmjs.com/package/systeminformation)`.getAllData()`

## Screenshots
![](https://user-images.githubusercontent.com/36796676/150057466-57ba8e93-1b91-4f6d-8ffc-4ec6daaf7b59.png)
![](https://user-images.githubusercontent.com/36796676/150055966-49b8941f-1591-42a1-8c9f-10d04833b218.png)
![](https://user-images.githubusercontent.com/36796676/150056080-c0676198-8748-47a3-9a38-a99e6d4770e2.png)
![](https://user-images.githubusercontent.com/36796676/150056305-9607517c-c46c-41fa-a493-990cf0052a1e.png)
![](https://user-images.githubusercontent.com/36796676/150056442-1a6d2417-fd90-4698-976a-c6d6671aa151.png)
![](https://user-images.githubusercontent.com/36796676/150056580-9bdd20f6-5bf9-47b0-9edb-222db703677e.png)
![](https://user-images.githubusercontent.com/36796676/150056670-5826f8f4-4574-48b0-843d-13fdd47fa102.png)

## Support
If something doesnt work, or you just wanna talk to the bot creator or her mom, write [@arelive](https://t.me/arelive). There also accepted kicks from volunteer project managers.
