import { accessEnv } from '@payhasly-discount/common'
import mongoose, { Model } from 'mongoose'
import { Language, Location } from './models'

// Connect to the MongoDB database
mongoose.connect(accessEnv('MONGO_DB_URI'))

// Create an array of sample data
const languages = [
    { name: 'English' },
    { name: 'Русский' },
    { name: 'Türkmen' }
]

const locations = [
    {
        nameTm: 'Aşgabat',
        nameRu: 'Ашхабад',
        nameEn: 'Ashgabat'
    },
    {
        nameTm: 'Daşoguz',
        nameRu: 'Дашогуз',
        nameEn: 'Dashoguz'
    },
    {
        nameTm: 'Mary',
        nameRu: 'Мары',
        nameEn: 'Mary'
    },
    {
        nameTm: 'Balkanabat',
        nameRu: 'Балканабат',
        nameEn: 'Balkanabat'
    },
    {
        nameTm: 'Turkmenabat',
        nameRu: 'Туркменабат',
        nameEn: 'Turkmenabat'
    },
    {
        nameTm: 'Türkmenbaşy',
        nameRu: 'Туркменбаши',
        nameEn: 'Turkmenbashy'
    }
]

function seed(
    model: Model<any, {}, {}, {}, any>,
    jsonData: { [key: string]: string }[]
) {
    model.deleteMany({}, (err) => {
        if (err) {
            console.error('Error clearing collection:', err)
        } else {
            console.log('Collection cleared successfully')

            // Insert the sample data into the collection
            model.insertMany(jsonData, (err, docs) => {
                if (err) {
                    console.error('Error inserting data:', err)
                } else {
                    console.log('Data inserted successfully:', docs)
                }

                // Close the connection to the database
                mongoose.connection.close()
            })
        }
    })
}

seed(Language, languages)
seed(Location, locations)

// Clear the existing data in the collection
