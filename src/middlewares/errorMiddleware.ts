import { Request, Response, NextFunction, response } from 'express'
import { HttpException } from '../utils'

export const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = error.status || 500
    const message = error.message || 'Server Error'

    res.status(status).send({ message })
}
