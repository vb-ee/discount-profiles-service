import { Types } from 'mongoose'

export interface IJwtPayload {
    id: Types.ObjectId
    phone: string
    isAdmin: boolean
}
