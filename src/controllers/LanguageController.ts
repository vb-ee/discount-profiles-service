import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { ILanguage, Language } from '../models'
import { BaseController } from './BaseController'
import { validationPipe, restrictToAdmin } from '../middlewares'
import { LanguageDto } from '../dtos'

export class LanguageController extends BaseController {
    public prefix = '/languages'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router
            .route(this.prefix)
            .get(this.getLanguages)
            .post(
                restrictToAdmin(),
                validationPipe(LanguageDto),
                this.createLanguage
            )
        this.router
            .route(`${this.prefix}/:id`)
            .get(this.getLanguageById)
            .put(
                restrictToAdmin(),
                validationPipe(LanguageDto, true),
                this.updateLanguageById
            )
            .delete(restrictToAdmin(), this.deleteLanguageById)
    }

    getLanguages = asyncHandler(async (req: Request, res: Response) => {
        const languages = await Language.find()
        this.ok(res, 200, languages)
    })

    createLanguage = asyncHandler(async (req: Request, res: Response) => {
        const language = await Language.create(<ILanguage>req.body)
        this.ok(res, 201, language)
    })

    getLanguageById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { languageId } = req.params
            const language = await Language.findById(languageId)
            if (!language) this.notFound(next, 'language', languageId)
            this.ok(res, 200, language)
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
            this.ok(res, 200, language)
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
