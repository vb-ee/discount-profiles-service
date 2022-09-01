import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IL, Language } from '../models'
import { BaseController } from './BaseController'
import { validationPipe } from '../middlewares'
import { LDto } from '../dtos'

export class LanguageController extends BaseController {
    public prefix = '/languages'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(this.prefix, this.getLanguages)
        this.router.post(this.prefix, validationPipe(LDto), this.createLanguage)
        this.router.get(`${this.prefix}/:id`, this.getLanguageById)
        this.router.put(
            `${this.prefix}/:id`,
            validationPipe(LDto, true),
            this.updateLanguageById
        )
        this.router.delete(`${this.prefix}/:id`, this.deleteLanguageById)
    }

    getLanguages = asyncHandler(async (req: Request, res: Response) => {
        const languages = await Language.find()
        this.ok(res, languages)
    })

    createLanguage = asyncHandler(async (req: Request, res: Response) => {
        await Language.create(<IL>req.body)
        this.created(res)
    })

    getLanguageById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { languageId } = req.params
            const language = await Language.findById(languageId)
            if (!language) this.notFound(next, 'language', languageId)
            this.ok(res, language)
        }
    )

    updateLanguageById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { languageId } = req.params
            const language = await Language.findByIdAndUpdate(
                languageId,
                req.body
            )
            if (!language) this.notFound(next, 'language', languageId)
            this.noContent(res)
        }
    )

    deleteLanguageById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { languageId } = req.params
            const language = await Language.findByIdAndDelete(languageId)
            if (!language) this.notFound(next, 'language', languageId)
            this.noContent(res)
        }
    )
}
