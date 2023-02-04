import { consumeMessage } from '@payhasly-discount/common'
import { User } from '../models/User'

export const createUser = consumeMessage(
    'AMQP_URL',
    'createUserProfile',
    async (msg) => {
        if (msg) {
            User.init()
            await User.create(JSON.parse(msg))
            console.log('User created')
        }
    }
)

export const updateUser = consumeMessage(
    'AMQP_URL',
    'updateUser',
    async (msg) => {
        if (msg) {
            const { id } = JSON.parse(msg)
            await User.updateOne({ id }, JSON.parse(msg))
            console.log('user updated')
        }
    }
)

export const deleteUser = consumeMessage(
    'AMQP_URL',
    'deleteUserProfile',
    async (msg) => {
        if (msg) {
            await User.findOneAndDelete({ id: msg })
            console.log('user deleted')
        }
    }
)
