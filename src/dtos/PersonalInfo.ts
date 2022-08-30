import { IsDate, IsEmail, IsEnum, IsMongoId, IsString } from 'class-validator'
import { Types } from 'mongoose'
import { IPersonalInfo, Gender } from '../models'

export class PersonalInfoDto implements IPersonalInfo {
    @IsString()
    @IsEmail()
    email: string

    @IsString()
    firstname: string

    @IsString()
    lastname: string

    @IsString()
    @IsEnum(Gender)
    gender: Gender

    @IsDate()
    birthdate: Date

    @IsString()
    aboutMe: string

    @IsString()
    imageUrl: string

    @IsMongoId()
    userId: Types.ObjectId
}
