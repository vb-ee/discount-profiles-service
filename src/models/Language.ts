import { Schema, model } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
export interface ILanguage {
    name: string
}

// 2. Create a Schema corresponding to the document interface.
const languageSchema = new Schema<ILanguage>(
    {
        name: { type: String, required: true }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
            }
        }
    }
)

// 3. Create a Model.
export const Language = model<ILanguage>('Language', languageSchema)
