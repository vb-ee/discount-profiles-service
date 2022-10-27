import { Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { HttpException } from '../utils'

export abstract class BaseController {
    public notFound(
        next: NextFunction,
        entityName?: string,
        entityId?: string | Types.ObjectId
    ) {
        return next(
            new HttpException(
                404,
                entityName
                    ? `${entityName} by ${entityId} not found`
                    : 'Resource not found'
            )
        )
    }

    public badRequest(next: NextFunction, message?: string) {
        return next(new HttpException(400, message ? message : 'Bad Request'))
    }

    public ok<T>(res: Response, statusCode: 200 | 201, dto?: T) {
        if (dto) {
            res.type('application/json')
            return res.status(statusCode).json({ dto })
        } else return res.sendStatus(statusCode)
    }

    public conflict(next: NextFunction, message?: string) {
        return next(new HttpException(409, message ? message : 'Conflict'))
    }

    public noContent(res: Response) {
        return res.sendStatus(204)
    }
}
