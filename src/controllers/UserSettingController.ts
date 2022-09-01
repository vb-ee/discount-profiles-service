import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IL, UserSetting } from '../models'
import { BaseController } from './BaseController'
import { validationPipe } from '../middlewares'
import { UserSettingDto } from '../dtos'

export class UserSettingController extends BaseController {
    private prefix = '/user-settings'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(this.prefix, this.getUserSettings)
        this.router.post(
            this.prefix,
            validationPipe(UserSettingDto),
            this.createUserSetting
        )
        this.router.get(`${this.prefix}/:id`, this.getUserSettingById)
        this.router.put(
            `${this.prefix}/:id`,
            validationPipe(UserSettingDto, true),
            this.updateUserSettingById
        )
        this.router.delete(`${this.prefix}/:id`, this.deleteUserSettingById)
    }

    getUserSettings = asyncHandler(async (req: Request, res: Response) => {
        const userSettings = await UserSetting.find()
        this.ok(res, userSettings)
    })

    createUserSetting = asyncHandler(async (req: Request, res: Response) => {
        await UserSetting.create(<IL>req.body)
        this.created(res)
    })

    getUserSettingById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userSettingId } = req.params
            const userSetting = await UserSetting.findById(userSettingId)
            if (!userSetting) this.notFound(next, 'userSetting', userSettingId)
            this.ok(res, userSetting)
        }
    )

    updateUserSettingById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userSettingId } = req.params
            const userSetting = await UserSetting.findByIdAndUpdate(
                userSettingId,
                req.body
            )
            if (!userSetting) this.notFound(next, 'userSetting', userSettingId)
            this.noContent(res)
        }
    )

    deleteUserSettingById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userSettingId } = req.params
            const userSetting = await UserSetting.findByIdAndDelete(
                userSettingId
            )
            if (!userSetting) this.notFound(next, 'userSetting', userSettingId)
            this.noContent(res)
        }
    )
}
