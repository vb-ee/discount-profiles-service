import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../utils'

export const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(error)
    const status = error.status || 500
    const message = error.message || 'Server Error'

    return res.status(status).send({ message })
}
