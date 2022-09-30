import fs from 'fs'

export const renameImagePath = (oldPath: string, newPath: string) => {
    fs.rename(oldPath, `${newPath}`, (err) => {
        console.log(err)
    })
}
