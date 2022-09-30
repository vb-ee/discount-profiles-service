import { IsString } from 'class-validator'
import { ILocation } from '../models'

export class LocationDto implements ILocation {
    @IsString()
    public nameEn: string

    @IsString()
    public nameRu: string

    @IsString()
    public nameTm: string
}
