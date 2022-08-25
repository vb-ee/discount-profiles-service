import { initConnection } from './db/connection'
import { App } from './startApp'

initConnection('mongodb://profiles-service-db/profilesdb')
    .then(() => {
        const app = new App(7074)
        app.listen()
    })
    .catch((err) => console.log(err))
