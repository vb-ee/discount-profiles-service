import { Schema, Types, model } from 'mongoose'
import { User } from './User'

export enum Gender {
    male = 'male',
    female = 'female'
}
export interface IPersonalInfo {
    email: string
    firstname: string
    lastname: string
    gender: Gender
    birthdate: Date
    aboutMe: string
    imageUrl: string
    user: Types.ObjectId
}

const personalInfoSchema = new Schema<IPersonalInfo>({
    email: { type: String, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String, enum: Gender },
    birthdate: { type: Date },
    aboutMe: { type: String },
    imageUrl: { type: String },
    user: { type: Schema.Types.ObjectId, ref: User }
})

export const PersonalInfo = model<IPersonalInfo>(
    'PersonalInfo',
    personalInfoSchema
)
