import { accessEnv } from '@payhasly-discount/common'
import { connect } from 'mongoose'

export const initConnection = async () => {
    await connect(accessEnv('MONGO_DB_URI'))
}
