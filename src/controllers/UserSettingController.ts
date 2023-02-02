import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IUserSetting, UserSetting } from '../models'
import { BaseController } from './BaseController'
import { validationPipe } from '../middlewares'
import { UserSettingDto } from '../dtos'
import { authHandler, restrictToAdmin, Tokens } from '@payhasly-discount/common'

export class UserSettingController extends BaseController {
    private prefix = '/user-settings'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router
            .route(this.prefix)
            .get(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                this.getUserSettings
            )
            .post(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                validationPipe(UserSettingDto),
                this.createUserSetting
            )
        this.router
            .route(`${this.prefix}/:id`)
            .get(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                this.getUserSettingById
            )
            .put(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                validationPipe(UserSettingDto, true),
                this.updateUserSettingById
            )
            .delete(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                this.deleteUserSettingById
            )
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
