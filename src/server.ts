import { initConnection } from './db/connection'
import { App } from './startApp'

initConnection()
    .then(() => {
        const app = new App(8080)
        app.listen()
    })
    .catch((err) => console.log(err))
