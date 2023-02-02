import { initConnection } from './db/connection'
import { App } from './startApp'
import * as consumers from './consumers/userConsumer'

initConnection()
    .then(() => {
        const app = new App(8080)
        app.listen()
        for (let consumer in consumers) {
            consumer
        }
    })
    .catch((err) => console.error(err))
