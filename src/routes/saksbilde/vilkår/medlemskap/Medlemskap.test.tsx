import {
    ApiKildetype,
    ApiKravkode,
    ApiMedlemskapsstatus,
    ApiMedlemskapsvurdering,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { render, screen } from '@test-utils';

import { Medlemskap, Medlemskapsdetaljer } from './Medlemskap';
import { Medlemskapsvurdering } from './useMedlemskapsvurdering';

const toggles = vi.hoisted(() => ({ kanOverstyreMedlemskap: true }));

vi.mock('@state/toggles', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toggles')>()),
    useKanOverstyreMedlemskap: () => toggles.kanOverstyreMedlemskap,
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => true,
}));

describe('Medlemskap', () => {
    it('viser knappen for å vurdere vilkåret når overstyring er skrudd på', () => {
        toggles.kanOverstyreMedlemskap = true;
        renderMedlemskap();

        expect(screen.getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
    });

    it('skjuler knappen for å vurdere vilkåret når overstyring er skrudd av', () => {
        toggles.kanOverstyreMedlemskap = false;
        renderMedlemskap();

        expect(screen.getByText('Må vurderes', { selector: '.aksel-tag' })).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it.each([
        { kildetype: ApiKildetype.AUTOMATISK, status: ApiMedlemskapsstatus.JA, vises: false },
        { kildetype: ApiKildetype.AUTOMATISK, status: ApiMedlemskapsstatus.NEI, vises: false },
        { kildetype: ApiKildetype.AUTOMATISK, status: ApiMedlemskapsstatus.UAVKLART, vises: false },
        { kildetype: ApiKildetype.AUTOMATISK, status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL, vises: true },
        { kildetype: ApiKildetype.SAKSBEHANDLER, status: ApiMedlemskapsstatus.JA, vises: true },
        { kildetype: ApiKildetype.SAKSBEHANDLER, status: ApiMedlemskapsstatus.NEI, vises: true },
        { kildetype: ApiKildetype.OVERFOERT_FRA_SPLEIS, status: ApiMedlemskapsstatus.JA, vises: false },
        { kildetype: ApiKildetype.OVERFOERT_FRA_SPLEIS, status: ApiMedlemskapsstatus.NEI, vises: false },
        { kildetype: ApiKildetype.OVERFOERT_FRA_SPLEIS, status: ApiMedlemskapsstatus.UAVKLART, vises: false },
        {
            kildetype: ApiKildetype.OVERFOERT_FRA_SPLEIS,
            status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
            vises: true,
            // NB! Får ikke vist årsaker på disse, men kan overstyre likevel. Spleis har ikke årsaker på disse.
        },
        { kildetype: ApiKildetype.OVERFOERT_FRA_INFOTRYGD, status: ApiMedlemskapsstatus.JA, vises: false },
        { kildetype: ApiKildetype.OVERFOERT_FRA_INFOTRYGD, status: ApiMedlemskapsstatus.NEI, vises: false },
        { kildetype: ApiKildetype.OVERFOERT_FRA_INFOTRYGD, status: ApiMedlemskapsstatus.UAVKLART, vises: false },
        {
            kildetype: ApiKildetype.OVERFOERT_FRA_INFOTRYGD,
            status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
            vises: false,
        },
    ])(
        'knappen for å vurdere vilkåret vises=$vises når kilde er $kildetype og status er $status',
        ({ kildetype, status, vises }) => {
            toggles.kanOverstyreMedlemskap = true;
            renderMedlemskap(kildetype, status);

            const knapp = screen.queryByRole('button', { name: 'Vurder vilkår' });
            if (vises) {
                expect(knapp).toBeVisible();
            } else {
                expect(knapp).not.toBeInTheDocument();
            }
        },
    );

    it('skjuler taggen med vurdert-tekst når kilden er ukjent', () => {
        const vurdering: ApiMedlemskapsvurdering = {
            ...enMedlemskapsvurdering().vurdering!,
            kilde: { kildetype: 'UKJENT' } as unknown as ApiMedlemskapsvurdering['kilde'],
        };
        render(<Medlemskapsdetaljer vurdering={vurdering} />);

        expect(screen.getByText('Må vurderes', { selector: '.aksel-tag' })).toBeVisible();
        expect(screen.queryByText('Oppfylt')).not.toBeInTheDocument();
    });
});

function renderMedlemskap(
    kildetype: ApiKildetype = ApiKildetype.AUTOMATISK,
    status: ApiMedlemskapsstatus = ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
) {
    render(
        <Medlemskap
            medlemskapsvurdering={enMedlemskapsvurdering(kildetype, status)}
            endringer={[]}
            readOnly={false}
            serPåTidligereBehandling={false}
            vurderer={false}
            onVurder={vi.fn()}
        />,
    );
}

function enMedlemskapsvurdering(
    kildetype: ApiKildetype = ApiKildetype.AUTOMATISK,
    status: ApiMedlemskapsstatus = ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
): Medlemskapsvurdering {
    return {
        vurdering: {
            id: 'en-medlemskapsvurdering-id',
            kravkode: ApiKravkode.MEDLEMSKAP,
            medlemskapOk: true,
            status,
            vurdertTidspunkt: '2022-01-02T10:00:00.000Z',
            kilde: {
                kildetype,
                versjonAvKildekode: '1',
                oppslagsperiode: { fom: '2022-01-01', tom: '2022-01-01' },
                årsaker: [],
            },
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        utfall: 'IkkeVurdert',
        erOverførtFraInfotrygd: kildetype === ApiKildetype.OVERFOERT_FRA_INFOTRYGD,
        onOverstyrt: vi.fn(),
    };
}
