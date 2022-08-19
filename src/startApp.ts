import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

export const startApp = () => {
    const app = express()
    const port = 7074

    app.use(bodyParser.json())
    app.use(cors())

    app.listen(port, '0.0.0.0', () => {
        console.info(`Profiles service listening on port ${port}`)
    })
}
