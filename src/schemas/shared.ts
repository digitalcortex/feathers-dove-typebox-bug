import { Type } from '@feathersjs/typebox'

export const TObjectId = () =>
    Type.Union([
        Type.String({ format: 'objectid', convert: true }),
        Type.Object({}, { additionalProperties: true })
    ])

export const TNullableObjectId = () => Type.Union([ TObjectId(), Type.Null() ])

export const TCurrencyCode = () => Type.String({ format: 'currency-code' })

export const TCountriesAndRegionsCode2 = () => Type.String({ format: 'countries-and-regions-code-2' })

export const TCountriesCode2 = () => Type.String({ format: 'countries-code-2' })

export const TURL = () => Type.String({ format: 'url' })

export const TDate = () => Type.Union([ Type.String({ format: 'date-time' }), Type.Date() ])