import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IProfile, IUserSetting, Profile, UserSetting } from '../models'
import { BaseController } from './BaseController'
import { uploadImage, validationPipe } from '../middlewares'
import { ProfileDto, UserSettingDto } from '../dtos'
import {
    authHandler,
    generateImageUrl,
    sendMessage,
    Tokens
} from '@payhasly-discount/common'

export class MeController extends BaseController {
    private prefix = ''
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router
            .route(`${this.prefix}/profile-image`)
            .put(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                uploadImage.single('avatar'),
                this.updateProfileImage
            )
        this.router
            .route(`${this.prefix}/profile`)
            .get(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                this.getMyProfile
            )
            .post(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                validationPipe(ProfileDto),
                this.createMyProfile
            )
            .put(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                validationPipe(ProfileDto, true),
                this.updateMyProfile
            )
            .delete(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                this.deleteMyProfile
            )

        this.router
            .route(`${this.prefix}/setting`)
            .get(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                this.getMySetting
            )
            .post(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                validationPipe(UserSettingDto),
                this.createMySetting
            )
            .put(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                validationPipe(UserSettingDto, true),
                this.updateMySetting
            )
            .delete(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                this.deleteMySetting
            )
    }

    getMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            const profile = await Profile.findOne({ userId: id }).populate(
                'user'
            )
            if (!profile) return this.notFound(next, 'profile for user', id)
            this.ok(res, 200, profile)
        }
    )

    createMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            let profile = await Profile.findOne({ userId: id })
            if (profile)
                return this.conflict(
                    next,
                    'profile for this user already exists'
                )

            profile = await Profile.create({
                ...(<IProfile>req.body),
                userId: id
            })

            this.ok(res, 201, profile)
        }
    )

    updateMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            let profile = await Profile.findOne({ userId: id })
            if (!profile) return this.notFound(next, 'profile with user', id)
            await profile.updateOne({ ...req.body })
            this.ok(res, 200, { id: profile._id, ...req.body })
        }
    )

    deleteMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            const profile = await Profile.findOne({ userId: id })
            if (!profile) return this.notFound(next, 'profile with user', id)
            if (profile.imageUrl && profile.imageUrl !== '')
                await sendMessage('AMQP_URL', profile.imageUrl, 'deleteImage')
            await profile.delete()
            this.noContent(res)
        }
    )

    getMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            const setting = await UserSetting.findOne({ userId: id }).populate(
                'user'
            )
            if (!setting) return this.notFound(next, 'setting for user', id)

            this.ok(res, 200, setting)
        }
    )

    createMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            let setting = await UserSetting.findOne({ userId: id })
            if (setting)
                return this.conflict(
                    next,
                    'setting for this user already exists'
                )

            setting = await UserSetting.create({
                ...(<IUserSetting>req.body),
                userId: id
            })

            this.ok(res, 201, setting)
        }
    )

    updateMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            let setting = await UserSetting.findOne({ userId: id })
            if (!setting) return this.notFound(next, 'setting with user', id)

            await setting.updateOne(<IUserSetting>req.body)

            this.ok(res, 200, { id: setting._id, ...req.body })
        }
    )

    deleteMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            const setting = await UserSetting.findOneAndDelete({ userId: id })
            if (!setting) return this.notFound(next, 'setting with user', id)
            this.noContent(res)
        }
    )

    updateProfileImage = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            let profile = await Profile.findOne({ userId: id })
            if (!profile) return this.notFound(next, 'profile with user', id)

            if (!req.file) {
                if (!profile.imageUrl || profile.imageUrl === '')
                    return this.notFound(next, 'image for the user', id)
                await sendMessage('AMQP_URL', profile.imageUrl, 'deleteImage')
                profile.imageUrl = ''
                await profile.save()
                this.noContent(res)
            } else {
                if (!profile.imageUrl || profile.imageUrl === '')
                    profile.imageUrl = generateImageUrl(
                        'API_GATEWAY_URL',
                        req.file.filename
                    )
                else {
                    await sendMessage(
                        'AMQP_URL',
                        profile.imageUrl,
                        'deleteImage'
                    )
                    profile.imageUrl = generateImageUrl(
                        'API_GATEWAY_URL',
                        req.file.filename
                    )
                }
                await profile.save()
                this.ok(res, 201, profile)
            }
        }
    )
}
