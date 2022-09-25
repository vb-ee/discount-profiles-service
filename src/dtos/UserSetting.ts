import { IsMongoId } from 'class-validator'
import { Types } from 'mongoose'
import { IUserSetting } from '../models'

export class UserSettingDto implements IUserSetting {
    @IsMongoId()
    location: Types.ObjectId

    @IsMongoId()
    language: Types.ObjectId

    @IsMongoId()
    user: Types.ObjectId
}
