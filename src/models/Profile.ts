import { Schema, Types, model, Model } from 'mongoose'
import { User } from './User'
import { unlink } from 'fs'

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
    imageUrl?: string
    user: Types.ObjectId
}

export interface IProfileMethods {
    removeImage(): void
}

type ProfileModel = Model<IProfile, {}, IProfileMethods>

const profileSchema = new Schema<IProfile, ProfileModel, IProfileMethods>({
    email: { type: String, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String, enum: Gender },
    birthdate: { type: Date },
    aboutMe: { type: String },
    imageUrl: { type: String },
    user: { type: Schema.Types.ObjectId, ref: User, autopopulate: true }
})

profileSchema.methods.removeImage = function () {
    unlink(`${process.env.PWD}/images/${this.imageUrl}`, (err) => {
        if (err) throw err
    })
}

profileSchema.plugin(require('mongoose-autopopulate'))

export const Profile = model<IProfile, ProfileModel>('Profile', profileSchema)
