import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { LanguageController } from './controllers'
import { errorMiddleware } from './middlewares'

export class App {
    public app: express.Application
    public port: number

    constructor(port: number) {
        this.app = express()
        this.port = port

        this.initializeMiddlewares()
        this.initializeRouters()
        this.initializeErrorHandler()
    }

    private initializeMiddlewares() {
        this.app.use(cors())
        this.app.use(bodyParser.json())
    }

    private initializeRouters() {
        this.app.use('/', new LanguageController().router)
    }

    private initializeErrorHandler() {
        this.app.use(errorMiddleware)
    }

    public listen() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Profile service is listening on port ${this.port}`)
        })
    }
}
