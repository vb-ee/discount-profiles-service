import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IProfile, Profile } from '../models'
import { BaseController } from './BaseController'
import { uploadImage, validationPipe } from '../middlewares'
import { ProfileDto } from '../dtos'
import {
    generateImageUrl,
    sendMessage,
    restrictToAdmin,
    authHandler,
    Tokens
} from '@payhasly-discount/common'

export class ProfileController extends BaseController {
    private prefix = '/profiles'
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
                this.getProfiles
            )
            .post(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                validationPipe(ProfileDto),
                uploadImage.single('avatar'),
                this.createProfile
            )
        this.router
            .route(`${this.prefix}/:id`)
            .get(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                this.getProfileById
            )
            .put(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                validationPipe(ProfileDto, true),
                uploadImage.single('avatar'),
                this.updateProfileById
            )
            .delete(
                authHandler(Tokens.accessToken, 'JWT_ACCESS'),
                restrictToAdmin(),
                this.deleteProfileById
            )
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

            const imageUrl = generateImageUrl(
                'API_GATEWAY_URL',
                req.file.filename
            )

            const profile = await Profile.create({
                ...(<IProfile>req.body),
                imageUrl
            })

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

            let profile = await Profile.findById(profileId)
            if (!profile) return this.notFound(next, 'profile', profileId)

            if (req.file) {
                await sendMessage('AMQP_URL', profile.imageUrl, 'deleteImage')
                const imageUrl = generateImageUrl(
                    'API_GATEWAY_URL',
                    req.file.filename
                )
                profileUpdateBody = { ...(<IProfile>req.body), imageUrl }
            } else profileUpdateBody = { ...(<IProfile>req.body) }

            await profile.updateOne(profileUpdateBody)

            this.ok(res, 200, { id: profile._id, ...profileUpdateBody })
        }
    )

    deleteProfileById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { profileId } = req.params
            const profile = await Profile.findById(profileId)
            if (!profile) return this.notFound(next, 'profile', profileId)
            await sendMessage('AMQP_URL', profile.imageUrl, 'deleteImage')
            await profile.delete()
            this.noContent(res)
        }
    )
}
