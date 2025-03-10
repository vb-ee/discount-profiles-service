import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import {
    LanguageController,
    LocationController,
    ProfileController,
    UserSettingController,
    MeController
} from './controllers'
import { errorMiddleware } from './middlewares'
import * as consumers from './consumers/userConsumer'
export class App {
    public app: express.Application
    public port: number

    constructor(port: number) {
        this.app = express()
        this.port = port

        this.initializeMiddlewares()
        this.initializeRouters([
            new MeController(),
            new LanguageController(),
            new LocationController(),
            new UserSettingController(),
            new ProfileController()
        ])
        this.intializeConsumers(consumers)
        this.initializeErrorHandler()
    }

    private initializeMiddlewares() {
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
    }

    private initializeRouters(controllers: any[]) {
        controllers.forEach((controller) =>
            this.app.use('/', controller.router)
        )
    }

    private intializeConsumers(consumers: { [key: string]: Promise<void> }) {
        for (const consumer in consumers) consumer
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
