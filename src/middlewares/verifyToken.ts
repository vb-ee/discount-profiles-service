import { Request, Response, NextFunction } from 'express'
import { IJwtPayload } from '../utils'
import * as jwt from 'jsonwebtoken'

export const verifyToken = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization
        let jwtPayload: IJwtPayload
        if (authHeader) {
            const token = authHeader.split(' ')[1]
            jwtPayload = jwt.verify(
                token,
                <string>process.env.JWT_ACCESS
            ) as IJwtPayload
        } else {
            return res
                .status(401)
                .send({ errors: 'Authorization header not found' })
        }

        req.payload = jwtPayload
        next()
    }
}
