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
    @IsOptional()
    email: string

    @IsString()
    @IsOptional()
    firstname: string

    @IsString()
    @IsOptional()
    lastname: string

    @IsString()
    @IsEnum(Gender)
    @IsOptional()
    gender: Gender

    @IsDateString()
    @IsOptional()
    birthdate: Date

    @IsUrl()
    @IsOptional()
    @IsOptional()
    imageUrl: string

    @IsString()
    @IsOptional()
    aboutMe: string

    @IsMongoId()
    @IsOptional()
    userId: Types.ObjectId
}
