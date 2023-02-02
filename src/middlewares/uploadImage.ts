import { multerSftp } from '@payhasly-discount/common'

export const uploadImage = multerSftp(
    'image-delivery-service',
    22,
    'node',
    'node',
    '/app/images'
)
