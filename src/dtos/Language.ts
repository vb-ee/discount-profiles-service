import { IsString } from 'class-validator'
import { ILanguage } from '../models'

export class LanguageDto implements ILanguage {
    @IsString()
    public name: string
}
