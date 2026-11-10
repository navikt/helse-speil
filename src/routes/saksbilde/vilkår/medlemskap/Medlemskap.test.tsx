import { ApiKildetype, ApiKravkode, ApiMedlemskapsstatus } from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { render, screen } from '@test-utils';

import { Medlemskap } from './Medlemskap';
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

        expect(screen.getByText('Uavklart med brukerspørsmål')).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });
});

function renderMedlemskap() {
    render(
        <Medlemskap
            medlemskapsvurdering={enMedlemskapsvurdering()}
            endringer={[]}
            readOnly={false}
            serPåTidligereBehandling={false}
            vurderer={false}
            onVurder={vi.fn()}
        />,
    );
}

function enMedlemskapsvurdering(): Medlemskapsvurdering {
    return {
        vurdering: {
            id: 'en-medlemskapsvurdering-id',
            kravkode: ApiKravkode.MEDLEMSKAP,
            medlemskapOk: true,
            status: ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL,
            vurdertTidspunkt: '2022-01-02T10:00:00.000Z',
            kilde: {
                kildetype: ApiKildetype.AUTOMATISK,
                versjonAvKildekode: '1',
                oppslagsperiode: { fom: '2022-01-01', tom: '2022-01-01' },
                årsaker: [],
            },
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
        utfall: 'IkkeVurdert',
        erOverførtFraInfotrygd: false,
        onOverstyrt: vi.fn(),
    };
}
