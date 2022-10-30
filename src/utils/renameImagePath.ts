import { rename } from 'fs'

export const renameImagePath = (oldPath: string, newPath: string) => {
    rename(oldPath, newPath, (err) => {
        if (err) throw err
    })
}
