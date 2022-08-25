import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { ExpressRouter } from './utils/ExpressRouter'

export class App {
    public app: express.Application
    public port: number

    // todo: fix the controllers type
    constructor(controllers, port: number) {
        this.app = express()
        this.port = port

        this.initializeMiddleware()
        this.initializeControllers(controllers)
    }

    initializeMiddleware() {
        this.app.use(cors())
        this.app.use(bodyParser.json())
    }

    initializeRoutes() {
        this.app.use(ExpressRouter.getInstance)
    }

    public listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Profile service is listening on port ${this.port}`)
        })
    }
}
