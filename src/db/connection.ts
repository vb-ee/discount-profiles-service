import { connect } from 'mongoose'

export const initConnection = async () => {
    await connect(<string>process.env.MONGO_DB_URI)
}
