const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
// Токен бота
const { token } = require("./token");
// const token = "5112066281:AAHT-GZ2sIVe74nBmeMnODW15FhobRxcnHU";
const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Я загадал число от 0 до 9");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
}

const start = () => {
    // Установка своих команд, создаст кнопку со списком команд с их описанием
    bot.setMyCommands([
        { command: "/start", description: "Начальное приветствие" },
        { command: "/info", description: "Получить информацию о пользователе" },
        { command: "/game", description: "Запустить игру" }
    ])

    bot.on("message", async (msg) => {
        // let text = `${msg.from.username} type ${msg.text}`
        // console.log(msg);

        let chatId = msg.chat.id;
        let text = msg.text;
        // bot.sendMessage(chatId, `Ты отправил мне ${text}`)

        if (text === "/start") {
            return bot.sendMessage(chatId, `Добро пожаловать в чат`);
        } else if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        } else if (text === "/game") {
            return startGame(chatId);
        }
        console.log(msg)
        return bot.sendMessage(chatId, "Я тебя не понимаю");
    })

    bot.on("callback_query", async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === "/again") {
            return startGame(chatId)
        }

        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Угадал ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Не угадал ${chats[chatId]}`, againOptions);
        }

    })

}
start();