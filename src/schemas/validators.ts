import { Ajv, addFormats } from '@feathersjs/schema'
import type { FormatsPluginOptions } from '@feathersjs/schema'
import { addConverters } from './converters'
import { TypeGuard } from '@sinclair/typebox/guard'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'

function schemaOf(schemaOf: string, value: unknown, schema: unknown) {
    switch (schemaOf) {
        case 'Constructor':
            return TypeGuard.TConstructor(schema) && Value.Check(schema, value) // not supported
        case 'Function':
            return TypeGuard.TFunction(schema) && Value.Check(schema, value) // not supported
        case 'Date':
            return TypeGuard.TDate(schema) && Value.Check(schema, value)
        case 'Promise':
            return TypeGuard.TPromise(schema) && Value.Check(schema, value) // not supported
        case 'Uint8Array':
            return TypeGuard.TUint8Array(schema) && Value.Check(schema, value)
        case 'Undefined':
            return TypeGuard.TUndefined(schema) && Value.Check(schema, value) // not supported
        case 'Void':
            return TypeGuard.TVoid(schema) && Value.Check(schema, value)
        default:
            return false
    }
}

const formats: FormatsPluginOptions = [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
]

const addKeywords = (ajv: Ajv) => {
    return ajv.addKeyword({ type: 'object', keyword: 'instanceOf', validate: schemaOf })
        .addKeyword({ type: 'null', keyword: 'typeOf', validate: schemaOf })
        .addKeyword('exclusiveMinimumTimestamp')
        .addKeyword('exclusiveMaximumTimestamp')
        .addKeyword('minimumTimestamp')
        .addKeyword('maximumTimestamp')
        .addKeyword('minByteLength')
        .addKeyword('maxByteLength')
}

export const dataValidator: Ajv = addKeywords(addFormats(new Ajv({}), formats))

export const queryValidator: Ajv = addKeywords(addFormats(new Ajv({
    coerceTypes: true
}), formats))

addConverters(dataValidator)
addConverters(queryValidator)