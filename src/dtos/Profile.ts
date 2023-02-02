import {
    IsDateString,
    IsEmail,
    IsEnum,
    IsMongoId,
    IsOptional,
    IsString,
    IsUrl
} from 'class-validator'
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

    @IsDateString()
    birthdate: Date

    @IsUrl()
    @IsOptional()
    imageUrl: string

    @IsString()
    aboutMe: string

    @IsMongoId()
    @IsOptional()
    userId: Types.ObjectId
}
