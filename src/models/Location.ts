import { Schema, model } from 'mongoose'

export interface ILocation {
    nameTm: string
    nameRu: string
    nameEn: string
}

// 2. Create a Schema corresponding to the document interface.
const locationSchema = new Schema<ILocation>({
    nameTm: { type: String, required: true },
    nameRu: { type: String, required: true },
    nameEn: { type: String, required: true }
})

// 3. Create a Model.
export const Location = model<ILocation>('Location', locationSchema)
