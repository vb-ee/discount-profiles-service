import { Schema, model } from 'mongoose'
import { IL } from './Language'

// 2. Create a Schema corresponding to the document interface.
const locationSchema = new Schema<IL>({
    nameTm: { type: String, required: true },
    nameRu: { type: String, required: true },
    nameEn: { type: String, required: true }
})

// 3. Create a Model.
export const Location = model<IL>('Location', locationSchema)
