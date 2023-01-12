import { Ajv } from '@feathersjs/schema'
import { ObjectId } from 'mongodb'
import currencyCode from '../utils/validation-formats/currency-code'
import { URL } from 'url'
import { getCountry } from 'iso-3166-1-alpha-2'

export function addConverters(validator: Ajv) {
    validator.addKeyword({
        type: 'string',
        keyword: 'convert',
        compile(schemaVal: boolean, parentSchema) {
            if (!schemaVal) return () => true
    
            // Convert date-time string to Date
            if ([ 'date-time', 'date' ].includes((parentSchema as any).format)) {
                return function (value: string, obj: any) {
                    const { parentData, parentDataProperty } = obj
                    parentData[ parentDataProperty ] = new Date(value)
                    return true
                }
            }
            // Convert objectid string to ObjectId
            else if ((parentSchema as any).format === 'objectid') {
                return function (value: string, obj: any) {
                    const { parentData, parentDataProperty } = obj
                    parentData[ parentDataProperty ] = new ObjectId(value)
                    return true
                }
            }
            return () => true
        }
    } as const)

    validator.addFormat('objectid', {
        type: 'string',
        validate: (id: string | ObjectId) => {
            if (ObjectId.isValid(id)) {
                if (String(new ObjectId(id)) === id) return true
                return false
            }
            return false
        }
    } as const)
    
    validator.addFormat('currency-code', {
        type: 'string',
        validate: currencyCode
    })

    validator.addFormat('url', {
        type: 'string',
        validate: function (val: string) {
            try {
                new URL(val)
                return true
            } catch (err) {
                return false
            }
        }
    })

    validator.addFormat('countries-and-regions-code-2', {
        type: 'string',
        validate: function (val: string) {
            const map: {[code: string]: string | undefined} = {
                EU: 'European Union',
                EX: 'European Economic Area',
                WO: 'Worldwide'
            }
            if (map[ val ]) {
                return true
            } else {
                return getCountry(val) ? true : false
            }
        }
    })

    validator.addFormat('countries-code-2', {
        type: 'string',
        validate: function (val: string) {
            return getCountry(val) ? true : false
        }
    })
}