import { Schema, model, Types } from 'mongoose'
import { User } from './User'

export interface IUserSetting {
    location: Types.ObjectId
    language: Types.ObjectId
    user: Types.ObjectId
}

const userSettingSchema = new Schema<IUserSetting>({
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        autopopulate: true
    },
    language: {
        type: Schema.Types.ObjectId,
        ref: 'Language',
        autopopulate: true
    },
    user: { type: Schema.Types.ObjectId, ref: User, autopopulate: true }
})

userSettingSchema.plugin(require('mongoose-autopopulate'))

export const UserSetting = model<IUserSetting>('UserSetting', userSettingSchema)
