import { Schema, model, Types } from 'mongoose'

export interface IUserSetting {
    location: Types.ObjectId
    language: Types.ObjectId
    userId: Types.ObjectId
}

const userSettingSchema = new Schema<IUserSetting>(
    {
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
        userId: { type: Schema.Types.ObjectId }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
                delete ret.userId
            },
            virtuals: true
        },
        toObject: { virtuals: true }
    }
)

userSettingSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: 'id',
    justOne: true
})

userSettingSchema.plugin(require('mongoose-autopopulate'))

export const UserSetting = model<IUserSetting>('UserSetting', userSettingSchema)
