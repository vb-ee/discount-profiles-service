import { Schema, model, Types } from 'mongoose'

export interface IUserSetting {
    locationId: Types.ObjectId
    languageId: Types.ObjectId
    userId: Types.ObjectId
}

const userSettingSchema = new Schema<IUserSetting>({
    locationId: { type: Schema.Types.ObjectId, ref: 'Location' },
    languageId: { type: Schema.Types.ObjectId, ref: 'Language' },
    userId: { type: Schema.Types.ObjectId }
})

export const UserSetting = model<IUserSetting>('UserSetting', userSettingSchema)
