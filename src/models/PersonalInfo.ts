import { Schema, Types, model } from 'mongoose'

interface IPersonalInfo {
    email: string
    firstname: string
    lastname: string
    gender: string
    birthdate: Date
    aboutMe: string
    imageUrl: string
    userId: Types.ObjectId
}

const personalInfoSchema = new Schema<IPersonalInfo>({
    email: { type: String, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    birthdate: { type: Date },
    aboutMe: { type: String },
    imageUrl: { type: String },
    userId: { type: Schema.Types.ObjectId }
})

export const PersonalInfo = model<IPersonalInfo>(
    'PersonalInfo',
    personalInfoSchema
)
