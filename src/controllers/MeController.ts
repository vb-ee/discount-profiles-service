import { ExpressRouter, renameImagePath } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IProfile, IUserSetting, Profile, UserSetting } from '../models'
import { BaseController } from './BaseController'
import { uploadImage, validationPipe } from '../middlewares'
import { ProfileDto, UserSettingDto } from '../dtos'
import { User } from '../models/User'

export class MeController extends BaseController {
    private prefix = '/me'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(`${this.prefix}/profile`, this.getMyProfile)
        this.router.post(
            `${this.prefix}/profile`,
            validationPipe(ProfileDto),
            uploadImage.single('avatar'),
            this.createMyProfile
        )
        this.router.put(
            `${this.prefix}/profile`,
            validationPipe(ProfileDto, true),
            uploadImage.single('avatar'),
            this.updateMyProfile
        )
        this.router.delete(`${this.prefix}/profile`, this.deleteMyProfile)

        this.router.get(`${this.prefix}/setting`, this.getMySetting)
        this.router.post(
            `${this.prefix}/setting`,
            validationPipe(UserSettingDto),
            this.createMySetting
        )
        this.router.put(
            `${this.prefix}/setting`,
            validationPipe(UserSettingDto, true),
            this.updateMySetting
        )
        this.router.delete(`${this.prefix}/setting`, this.deleteMySetting)
    }

    getMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            const profile = await Profile.findOne({ user: id })
            if (!profile) return this.notFound(next, 'profile for user', id)

            this.ok(res, 200, profile)
        }
    )

    createMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            let profile = await Profile.findOne({ user: id })
            if (profile)
                return this.conflict(
                    next,
                    'profile for this user already exists'
                )

            if (!req.file)
                return this.badRequest(
                    next,
                    'Image file has to be defined in req'
                )

            const imageUrl = `${req.file.destination}/${req.file.originalname}`
            renameImagePath(<string>req.file.path, imageUrl)

            const profileToCreate = { ...(<IProfile>req.body), imageUrl }
            profile = await Profile.create(profileToCreate)

            this.ok(res, 201, profile)
        }
    )

    updateMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            let profileUpdateBody: IProfile
            let imageUrl: string

            let profile = await Profile.findOne({ user: id })
            if (!profile) return this.notFound(next, 'profile with user', id)

            if (req.file) {
                profile.removeImage()
                imageUrl = `${req.file.destination}/${req.file.originalname}`
                renameImagePath(<string>req.file.path, imageUrl)
                profileUpdateBody = { ...(<IProfile>req.body), imageUrl }
            } else profileUpdateBody = { ...(<IProfile>req.body) }

            profile = await profile.update(profileUpdateBody)

            this.ok(res, 200, profile)
        }
    )

    deleteMyProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            const profile = await Profile.findOneAndDelete({ user: id })
            if (!profile) return this.notFound(next, 'profile with user', id)
            profile.removeImage()
            this.noContent(res)
        }
    )

    getMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            const setting = await UserSetting.findOne({ user: id })
            if (!setting) return this.notFound(next, 'setting for user', id)

            this.ok(res, 200, setting)
        }
    )

    createMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            let setting = await UserSetting.findOne({ user: id })
            if (setting)
                return this.conflict(
                    next,
                    'setting for this user already exists'
                )

            setting = await UserSetting.create(<IUserSetting>req.body)

            this.ok(res, 201, setting)
        }
    )

    updateMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload

            let setting = await UserSetting.findOne({ user: id })
            if (!setting) return this.notFound(next, 'setting with user', id)

            setting = await setting.update(<IUserSetting>req.body)

            this.ok(res, 200, setting)
        }
    )

    deleteMySetting = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.payload
            const setting = await UserSetting.findOneAndDelete({ user: id })
            if (!setting) return this.notFound(next, 'setting with user', id)
            this.noContent(res)
        }
    )
}
