import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { IL, Location } from '../models'
import { BaseController } from './BaseController'
import { validationPipe } from '../middlewares'
import { LDto } from '../dtos'

export class LocationController extends BaseController {
    public prefix = '/locations'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(this.prefix, this.getLocations)
        this.router.post(this.prefix, validationPipe(LDto), this.createLocation)
        this.router.get(`${this.prefix}/:id`, this.getLocationById)
        this.router.put(
            `${this.prefix}/:id`,
            validationPipe(LDto, true),
            this.updateLocationById
        )
        this.router.delete(`${this.prefix}/:id`, this.deleteLocationById)
    }

    getLocations = asyncHandler(async (req: Request, res: Response) => {
        const locations = await Location.find()
        this.ok(res, locations)
    })

    createLocation = asyncHandler(async (req: Request, res: Response) => {
        await Location.create(<IL>req.body)
        this.created(res)
    })

    getLocationById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { locationId } = req.params
            const location = await Location.findById(locationId)
            if (!location) this.notFound(next, 'location', locationId)
            this.ok(res, location)
        }
    )

    updateLocationById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { locationId } = req.params
            const location = await Location.findByIdAndUpdate(
                locationId,
                req.body
            )
            if (!location) this.notFound(next, 'location', locationId)
            this.noContent(res)
        }
    )

    deleteLocationById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { locationId } = req.params
            const location = await Location.findByIdAndDelete(locationId)
            if (!location) this.notFound(next, 'location', locationId)
            this.noContent(res)
        }
    )
}
