import { IsDate, IsEmail, IsEnum, IsMongoId, IsString } from 'class-validator'
import { Types } from 'mongoose'
import { IProfile, Gender } from '../models'

export class ProfileDto implements IProfile {
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

    @IsMongoId()
    user: Types.ObjectId
}
