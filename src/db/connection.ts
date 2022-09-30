import { connect } from 'mongoose'

export const initConnection = async () => {
    await connect('mongodb://profiles-service-db:27017/profiles')
}
