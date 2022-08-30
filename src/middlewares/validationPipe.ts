import { Request, Response, NextFunction, RequestHandler } from 'express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { HttpException } from '../utils'

export const validationPipe = (
    dto: any,
    skipMissingProperties = false
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        validate(plainToInstance(dto, req.body), {
            skipMissingProperties
        }).then((errors) => {
            if (errors.length > 0) {
                const message = errors
                    .map((error) => {
                        if (error.constraints) Object.values(error.constraints)
                    })
                    .join(', ')
                next(new HttpException(400, message))
            } else {
                next()
            }
        })
    }
}
