import { IsMongoId, IsOptional } from 'class-validator'
import { Types } from 'mongoose'
import { IUserSetting } from '../models'

export class UserSettingDto implements IUserSetting {
    @IsMongoId()
    @IsOptional()
    location: Types.ObjectId

    @IsMongoId()
    @IsOptional()
    language: Types.ObjectId

    @IsMongoId()
    @IsOptional()
    userId: Types.ObjectId
}
