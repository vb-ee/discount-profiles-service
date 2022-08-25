import express from 'express'

export class ExpressRouter {
    private static instance: express.Router

    static getInstance(): ExpressRouter {
        if (!ExpressRouter.instance) ExpressRouter.instance = express.Router()
        return ExpressRouter.instance
    }
}
