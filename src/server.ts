import { initConnection } from './db/connection'
import { startApp } from './startApp'

initConnection('mongodb://profiles-service-db/profilesdb')
    .then(() => {
        startApp()
    })
    .catch((err) => console.log(err))
