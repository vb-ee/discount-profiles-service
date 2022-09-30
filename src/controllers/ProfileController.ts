import { ExpressRouter, renameImagePath } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IProfile, Profile } from '../models'
import { BaseController } from './BaseController'
import { uploadImage, validationPipe } from '../middlewares'
import { ProfileDto } from '../dtos'

export class ProfileController extends BaseController {
    private prefix = '/profiles'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(this.prefix, this.getProfiles)
        this.router.post(
            this.prefix,
            validationPipe(ProfileDto),
            uploadImage.single('avatar'),
            this.createProfile
        )
        this.router.get(`${this.prefix}/:id`, this.getProfileById)
        this.router.put(
            `${this.prefix}/:id`,
            validationPipe(ProfileDto, true),
            uploadImage.single('avatar'),
            this.updateProfileById
        )
        this.router.delete(`${this.prefix}/:id`, this.deleteProfileById)
    }

    getProfiles = asyncHandler(async (req: Request, res: Response) => {
        const profiles = await Profile.find()
        this.ok(res, 200, profiles)
    })

    createProfile = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            if (!req.file)
                return this.badRequest(
                    next,
                    'Image file has to be defined in req'
                )

            const imageUrl = `${req.file.destination}/${req.file.originalname}`
            renameImagePath(<string>req.file.path, imageUrl)

            const profileToCreate = { ...(<IProfile>req.body), imageUrl }
            const profile = await Profile.create(profileToCreate)

            this.ok(res, 201, profile)
        }
    )

    getProfileById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { profileId } = req.params
            const profile = await Profile.findById(profileId)
            if (!profile) this.notFound(next, 'profile', profileId)
            this.ok(res, 200, profile)
        }
    )

    updateProfileById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { profileId } = req.params
            let profileUpdateBody: IProfile
            let imageUrl: string

            let profile = await Profile.findById(profileId)
            if (!profile) return this.notFound(next, 'profile', profileId)

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

    deleteProfileById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { profileId } = req.params
            const profile = await Profile.findByIdAndDelete(profileId)
            if (!profile) return this.notFound(next, 'profile', profileId)
            profile.removeImage()
            this.noContent(res)
        }
    )
}
