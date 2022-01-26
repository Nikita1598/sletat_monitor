const puppeteer = require("puppeteer");
const request = require("request-promise")

async function start() {
    setInterval(monitor, 60000)
}

async function monitor() {
    const browserApp = await puppeteer.launch();
    const pageApp = await browserApp.newPage();
    await pageApp.goto("https://sletat.ru/search/from-moscow-to-turkey-for-february-nights-7..10-adults-2-kids-zero?datefrom=01/02/2022&dateto=08/02/2022&currency=RUB&operators=380&ticketsincluded=true&hastickets=true&places=true&onlyCharter=false&onlyInstant=false", {
        waitUntil: "networkidle0"
    });
    await pageApp.click(".b-uikit-button_search", {})
    try {
        await pageApp.waitForNavigation()
        const result = await pageApp.evaluate(() => {
                try {
                    return document.documentElement.outerHTML;
                } catch (e) {
                    return e.toString();
                }
            }
        )

        let message = ""
        if (result.includes("tour-not-found-message")) {
            message = "ALARM!!! Туры не найдены:("
        } else {
            message = "Все ок. Туры на месте:)"
        }
        const options = {
            method: 'POST',
            uri: "https://api.telegram.org/bot5137146899:AAEiYNK1od6GZP9rCjfuI2etpRWtISo5lWw/sendMessage",
            qs: {
                chat_id: -669362900,
                parse_mode: 'html',
                text: message
            }
        }

        request(options)
    } catch (e) {
        const result = await pageApp.evaluate(() => {
                try {
                    return document.documentElement.outerHTML;
                } catch (e) {
                    return e.toString();
                }
            }
        )
        let message = ""
        if (result.includes("tour-not-found-message")) {
            message = "ALARM!!! Туры не найдены:("
        } else {
            message = "Все ок. Туры на месте:)"
        }
        const options = {
            method: 'POST',
            uri: "https://api.telegram.org/bot5137146899:AAEiYNK1od6GZP9rCjfuI2etpRWtISo5lWw/sendMessage",
            qs: {
                chat_id: -669362900,
                parse_mode: 'html',
                text: message
            }
        }

        request(options)
    }

    browserApp.close()
}

start()
