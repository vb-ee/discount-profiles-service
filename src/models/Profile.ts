import { Schema, Types, model } from 'mongoose'

export enum Gender {
    male = 'male',
    female = 'female'
}

export interface IProfile {
    email: string
    firstname: string
    lastname: string
    gender: Gender
    birthdate: Date
    aboutMe: string
    imageUrl: string
    userId: Types.ObjectId
}

const profileSchema = new Schema<IProfile>(
    {
        email: { type: String, unique: true },
        firstname: { type: String },
        lastname: { type: String },
        gender: { type: String, enum: Gender },
        birthdate: { type: Date },
        aboutMe: { type: String },
        imageUrl: { type: String },
        userId: { type: Schema.Types.ObjectId, autopopulate: true }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
            }
        },
        toObject: { virtuals: true }
    }
)

profileSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: 'id',
    justOne: true
})

profileSchema.plugin(require('mongoose-autopopulate'))

export const Profile = model<IProfile>('Profile', profileSchema)
