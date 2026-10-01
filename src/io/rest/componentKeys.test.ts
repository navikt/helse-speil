import { decodeComponentKeys, encodeComponentKey, encodeComponentKeysInSpec } from './componentKeys';

describe('encodeComponentKey', () => {
    it('encodes ÆØÅ as ASCII tokens matching the OpenAPI regex', () => {
        const encoded = encodeComponentKey('ApiPåVentÆrsakØ');
        expect(encoded).toMatch(/^[a-zA-Z0-9.\-_]+$/);
        expect(decodeComponentKeys(encoded)).toEqual('ApiPåVentÆrsakØ');
    });

    it('leaves valid keys untouched', () => {
        expect(encodeComponentKey('ApiOppgave_v2.Liste-1')).toEqual('ApiOppgave_v2.Liste-1');
    });

    it('throws if the key starts with an invalid character', () => {
        expect(() => encodeComponentKey('Årsak')).toThrow();
    });
});

describe('encodeComponentKeysInSpec', () => {
    const spec = {
        paths: {
            '/api/x': {
                get: {
                    responses: {
                        '200': {
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiPåVent' } } },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                ApiPåVent: { type: 'object', properties: { årsak: { type: 'string', enum: ['MANGLER_ÅRSAKER'] } } },
                ApiSkjønnsfastsatt: { type: 'object' },
                ApiRequest: {
                    properties: {
                        type: {
                            oneOf: [{ $ref: '#/components/schemas/ApiSkj%C3%B8nnsfastsatt' }],
                            discriminator: {
                                propertyName: 'type',
                                mapping: { ApiSkjønnsfastsatt: 'ApiSkjønnsfastsatt' },
                            },
                        },
                        discriminator: { $ref: '#/components/schemas/ApiPåVent' },
                    },
                },
            },
        },
    };

    const encoded = encodeComponentKeysInSpec(spec);
    const schemas = encoded.components.schemas as Record<string, unknown>;

    it('encodes all component keys', () => {
        expect(Object.keys(schemas).every((key) => /^[a-zA-Z0-9.\-_]+$/.test(key))).toBe(true);
        expect(Object.keys(schemas).map(decodeComponentKeys)).toEqual(Object.keys(spec.components.schemas));
    });

    it('encodes $refs, including percent-encoded ones, so they point to the encoded keys', () => {
        const ref = encoded.paths['/api/x'].get.responses['200'].content['application/json'].schema.$ref;
        expect(ref).toEqual(`#/components/schemas/${encodeComponentKey('ApiPåVent')}`);

        const request = schemas.ApiRequest as typeof spec.components.schemas.ApiRequest;
        expect(request.properties.type.oneOf[0]?.$ref).toEqual(
            `#/components/schemas/${encodeComponentKey('ApiSkjønnsfastsatt')}`,
        );
        expect(request.properties.discriminator.$ref).toEqual(
            `#/components/schemas/${encodeComponentKey('ApiPåVent')}`,
        );
    });

    it('encodes the values in discriminator.mapping, but not the keys', () => {
        const request = schemas.ApiRequest as typeof spec.components.schemas.ApiRequest;
        expect(request.properties.type.discriminator.mapping).toEqual({
            ApiSkjønnsfastsatt: encodeComponentKey('ApiSkjønnsfastsatt'),
        });
    });

    it('leaves property names and enum values untouched', () => {
        const påVent = schemas[encodeComponentKey('ApiPåVent')];
        expect(påVent).toEqual(spec.components.schemas.ApiPåVent);
    });
});
