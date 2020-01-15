import request from 'request-promise-native';

interface PostVedtakOptions {
    behovId: string;
    aktørId: string;
    saksbehandlerIdent: string;
    vedtaksperiodeId: string;
    godkjent: boolean;
    accessToken: string;
}

const postVedtak = async ({
    behovId,
    aktørId,
    saksbehandlerIdent,
    vedtaksperiodeId,
    godkjent,
    accessToken
}: PostVedtakOptions) => {
    const options = {
        uri: `http://spade.default.svc.nais.local/api/vedtak`,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: { behovId, aktørId, saksbehandlerIdent, godkjent, vedtaksperiodeId },
        json: true
    };

    return request.post(options);
};

export { postVedtak };
