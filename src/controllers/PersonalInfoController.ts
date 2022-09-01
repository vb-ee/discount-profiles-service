import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IL, PersonalInfo } from '../models'
import { BaseController } from './BaseController'
import { validationPipe } from '../middlewares'
import { PersonalInfoDto } from '../dtos'

export class PersonalInfoController extends BaseController {
    private prefix = '/personal-infos'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(this.prefix, this.getPersonalInfos)
        this.router.post(
            this.prefix,
            validationPipe(PersonalInfoDto),
            this.createPersonalInfo
        )
        this.router.get(`${this.prefix}/:id`, this.getPersonalInfoById)
        this.router.put(
            `${this.prefix}/:id`,
            validationPipe(PersonalInfoDto, true),
            this.updatePersonalInfoById
        )
        this.router.delete(`${this.prefix}/:id`, this.deletePersonalInfoById)
    }

    getPersonalInfos = asyncHandler(async (req: Request, res: Response) => {
        const personalInfos = await PersonalInfo.find()
        this.ok(res, personalInfos)
    })

    createPersonalInfo = asyncHandler(async (req: Request, res: Response) => {
        await PersonalInfo.create(<IL>req.body)
        this.created(res)
    })

    getPersonalInfoById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { personalInfoId } = req.params
            const personalInfo = await PersonalInfo.findById(personalInfoId)
            if (!personalInfo)
                this.notFound(next, 'personalInfo', personalInfoId)
            this.ok(res, personalInfo)
        }
    )

    updatePersonalInfoById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { personalInfoId } = req.params
            const personalInfo = await PersonalInfo.findByIdAndUpdate(
                personalInfoId,
                req.body
            )
            if (!personalInfo)
                this.notFound(next, 'personalInfo', personalInfoId)
            this.noContent(res)
        }
    )

    deletePersonalInfoById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { personalInfoId } = req.params
            const personalInfo = await PersonalInfo.findByIdAndDelete(
                personalInfoId
            )
            if (!personalInfo)
                this.notFound(next, 'personalInfo', personalInfoId)
            this.noContent(res)
        }
    )
}
