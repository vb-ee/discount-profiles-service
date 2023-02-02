import { model, Schema, Types } from 'mongoose'
import { Profile } from './Profile'
import { UserSetting } from './UserSetting'
// Create an interface representing a document in MongoDB.
export interface IUser {
    id: Types.ObjectId
    phone: string
    isAdmin: boolean
    createdAt: Date
    updatedAt: Date
}

// Create a Schema corresponding to the document interfaces.
export const userSchema = new Schema<IUser>(
    {
        id: Types.ObjectId,
        phone: String,
        isAdmin: { type: Boolean, default: false }
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret._id
            }
        },
        versionKey: false
    }
)

userSchema.post('findOneAndDelete', async function (doc, next) {
    await Profile.findOneAndDelete({ userId: doc.id })
    await UserSetting.findOneAndDelete({ userId: doc.id })
    next()
})

export const User = model<IUser>('User', userSchema)
