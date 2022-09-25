import { Schema } from 'mongoose'
import { createConnection } from 'mongoose'

const userDatabase = createConnection('mongodb://users-service-db/usersdb')
// Create an interface representing a document in MongoDB.
export interface IUser {
    phone: string
    password: string
    isAdmin: boolean
}

// Create a Schema corresponding to the document interfaces.
export const userSchema = new Schema<IUser>(
    {
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        isAdmin: { type: Boolean, default: false }
    },
    { timestamps: true }
)

export const User = userDatabase.model('User', userSchema)
