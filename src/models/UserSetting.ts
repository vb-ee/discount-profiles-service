import { Schema, model, Types } from 'mongoose'
import { User } from './User'

export interface IUserSetting {
    location: Types.ObjectId
    language: Types.ObjectId
    user: Types.ObjectId
}

const userSettingSchema = new Schema<IUserSetting>({
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    language: { type: Schema.Types.ObjectId, ref: 'Language' },
    user: { type: Schema.Types.ObjectId, ref: User }
})

export const UserSetting = model<IUserSetting>('UserSetting', userSettingSchema)
