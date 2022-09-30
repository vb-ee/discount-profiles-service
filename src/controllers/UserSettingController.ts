import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IUserSetting, UserSetting } from '../models'
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
        this.ok(res, 200, userSettings)
    })

    createUserSetting = asyncHandler(async (req: Request, res: Response) => {
        const userSetting = await UserSetting.create(<IUserSetting>req.body)
        this.ok(res, 201, userSetting)
    })

    getUserSettingById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { userSettingId } = req.params
            const userSetting = await UserSetting.findById(userSettingId)
            if (!userSetting) this.notFound(next, 'userSetting', userSettingId)
            this.ok(res, 200, userSetting)
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
            this.ok(res, 200, userSetting)
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
