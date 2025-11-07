import { ApiDokumentInntektsmelding } from '@io/rest/generated/spesialist.schemas';

export const stub = async () => {
    if (Math.random() > 0.9) return Response.error();
    else return Response.json(mockedInntektsmelding);
};

const mockedInntektsmelding: ApiDokumentInntektsmelding = {
    arbeidsforholdId: '123431242',
    virksomhetsnummer: '967170232',
    innsenderFulltNavn: 'MUSKULØS VALS',
    innsenderTelefon: '12345678',
    begrunnelseForReduksjonEllerIkkeUtbetalt: '',
    bruttoUtbetalt: null,
    beregnetInntekt: 35000.0,
    refusjon: {
        beloepPrMnd: 0.0,
        opphoersdato: null,
    },
    endringIRefusjoner: [],
    opphoerAvNaturalytelser: [],
    gjenopptakelseNaturalytelser: [],
    arbeidsgiverperioder: [
        {
            fom: '2023-08-01',
            tom: '2023-08-13',
        },
        {
            fom: '2023-08-14',
            tom: '2023-08-16',
        },
    ],
    ferieperioder: [],
    foersteFravaersdag: '2023-08-01',
    naerRelasjon: null,
    inntektEndringAarsaker: [
        {
            aarsak: 'NyStillingsprosent',
            perioder: null,
            gjelderFra: '2025-01-01',
            bleKjent: null,
        },
        {
            aarsak: 'Permisjon',
            perioder: [
                {
                    fom: '2025-01-01',
                    tom: '2025-01-02',
                },
            ],
            gjelderFra: null,
            bleKjent: null,
        },
    ],
    avsenderSystem: {
        navn: 'SAP (SID:PO01/200)[BUILD: 20230616}',
    },
};
