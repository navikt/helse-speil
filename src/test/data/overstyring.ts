import { SpleisSykdomsdagtype } from 'external-types';

export const umappetOverstyring = {
    hendelseId: 'E6201F83-3104-4D85-840C-C7977B3E788D',
    begrunnelse: 'en begrunnelse',
    timestamp: '2020-01-01T12:00:00',
    saksbehandlerNavn: 'Sara Saksbehandler',
    overstyrteDager: [
        {
            dato: '2020-01-01',
            dagtype: SpleisSykdomsdagtype.SYKEDAG,
            grad: 60,
        },
    ],
};
