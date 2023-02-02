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
                let errorsToSend: { [key: string]: string } = {}
                // looping through each item of errors array
                for (const errorItem of errors) {
                    // looping through each key:value of constraints object
                    for (const key in errorItem.constraints) {
                        // assign each key of consttraints object to errorKeys object
                        errorsToSend[key] = errorItem.constraints[key]
                    }
                }
                console.log(errorsToSend)
                next(new HttpException(400, JSON.stringify(errorsToSend)))
            } else {
                next()
            }
        })
    }
}
