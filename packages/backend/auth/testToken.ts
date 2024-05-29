export const createTokenForTest = () =>
    `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')}.${Buffer.from(
        JSON.stringify({
            name: 'S. A. Ksbehandler',
            email: 'dev@nav.no',
            NAVident: 'dev-ident',
            oid: '4577332e-801a-4c13-8a71-39f12b8abfa3',
        }),
    ).toString('base64')}.bogussignature`;
