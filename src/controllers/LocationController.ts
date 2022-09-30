import { ExpressRouter } from '../utils'
import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response } from 'express'
import { ILocation, Location } from '../models'
import { BaseController } from './BaseController'
import { validationPipe } from '../middlewares'
import { LocationDto } from '../dtos'

export class LocationController extends BaseController {
    public prefix = '/locations'
    public router = ExpressRouter.getInstance()

    constructor() {
        super()
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.get(this.prefix, this.getLocations)
        this.router.post(
            this.prefix,
            validationPipe(LocationDto),
            this.createLocation
        )
        this.router.get(`${this.prefix}/:id`, this.getLocationById)
        this.router.put(
            `${this.prefix}/:id`,
            validationPipe(LocationDto, true),
            this.updateLocationById
        )
        this.router.delete(`${this.prefix}/:id`, this.deleteLocationById)
    }

    getLocations = asyncHandler(async (req: Request, res: Response) => {
        const locations = await Location.find()
        this.ok(res, 200, locations)
    })

    createLocation = asyncHandler(async (req: Request, res: Response) => {
        const location = await Location.create(<ILocation>req.body)
        this.ok(res, 201, location)
    })

    getLocationById = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { locationId } = req.params
            const location = await Location.findById(locationId)
            if (!location) this.notFound(next, 'location', locationId)
            this.ok(res, 200, location)
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
            this.ok(res, 200, location)
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
