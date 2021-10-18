import { testEnkelPeriodeFom } from './person';

export const umappetOverstyring = (override?: Partial<ExternalTidslinjeoverstyring>): ExternalTidslinjeoverstyring => ({
    type: 'Dager',
    hendelseId: 'E6201F83-3104-4D85-840C-C7977B3E788D',
    begrunnelse: 'en begrunnelse',
    timestamp: '2020-01-01T12:00:00',
    saksbehandlerNavn: 'Sara Saksbehandler',
    saksbehandlerIdent: 'S123456',
    overstyrteDager: override?.overstyrteDager ?? [
        {
            dato: testEnkelPeriodeFom,
            dagtype: 'SYKEDAG',
            grad: 60,
        },
    ],
    ...override,
});
