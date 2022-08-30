import { IsString } from 'class-validator'
import { IL } from '../models'

export class LDto implements IL {
    @IsString()
    public nameEn: string

    @IsString()
    public nameRu: string

    @IsString()
    public nameTm: string
}
