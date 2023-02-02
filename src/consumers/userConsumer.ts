import { consumeMessage } from '@payhasly-discount/common'
import { User } from '../models/User'

export const createUser = consumeMessage(
    'AMQP_URL',
    'createUser',
    async (msg) => {
        if (msg) {
            const user = JSON.parse(msg.content.toString())
            User.init()
            await User.create(user)
            console.log('User created')
        }
    }
)

export const updateUser = consumeMessage(
    'AMQP_URL',
    'updateUser',
    async (msg) => {
        if (msg) {
            console.log(JSON.parse(msg.content.toString()))
            // await User.updateOne({ id }, { phone, isAdmin })
            console.log('user updated')
        }
    }
)

export const deleteUser = consumeMessage(
    'AMQP_URL',
    'deleteUser',
    async (msg) => {
        if (msg) {
            await User.findOneAndDelete({ id: msg.content.toString() })
            console.log('user deleted')
        }
    }
)
