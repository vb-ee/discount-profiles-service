import { IsMongoId } from 'class-validator'
import { Types } from 'mongoose'
import { IUserSetting } from '../models'

export class UserSettingDto implements IUserSetting {
    @IsMongoId()
    locationId: Types.ObjectId

    @IsMongoId()
    languageId: Types.ObjectId

    @IsMongoId()
    userId: Types.ObjectId
}
