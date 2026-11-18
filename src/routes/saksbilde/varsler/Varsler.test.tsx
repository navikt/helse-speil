import { Mock } from 'vitest';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { render, screen } from '@test-utils';

import { Varsler } from './Varsler';
import { useSkalViseMedlemskapsvarselSomFeil } from './useSkalViseMedlemskapsvarselSomFeil';

vi.mock('@hooks/brukerrolleHooks', () => ({ useHarSkrivetilgang: () => true }));
vi.mock('./useSkalViseAvviksvarselSomFeil', () => ({ useSkalViseAvviksvarselSomFeil: () => false }));
vi.mock('@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel', () => ({
    useSkalViseUnder20SykdomsgradsvarselSomFeil: () => false,
}));
vi.mock('./useSkalViseMedlemskapsvarselSomFeil', () => ({ useSkalViseMedlemskapsvarselSomFeil: vi.fn() }));

describe('Varsler', () => {
    it('viser medlemskapsvarselet som feil uten avhuking', () => {
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: true, henterStatus: false });

        render(<Varsler varsler={[medlemskapsvarsel]} />);

        expect(screen.getByTitle('Feil')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurdert' })).not.toBeInTheDocument();
    });

    it('viser medlemskapsvarselet som vanlig varsel med avhuking', () => {
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: false, henterStatus: false });

        render(<Varsler varsler={[medlemskapsvarsel]} />);

        expect(screen.queryByTitle('Feil')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Vurdert' })).toBeInTheDocument();
    });
    it('viser ventesnurr i stedet for avhuking mens medlemskapsstatusen hentes', () => {
        (useSkalViseMedlemskapsvarselSomFeil as Mock).mockReturnValue({ skalViseSomFeil: false, henterStatus: true });

        render(<Varsler varsler={[medlemskapsvarsel]} />);

        expect(screen.getByTitle(/venter/i)).toBeInTheDocument();
        expect(screen.queryByTitle('Feil')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurdert' })).not.toBeInTheDocument();
    });
});

const medlemskapsvarsel: ApiVarselDTO = {
    id: '2ef79f41-5be9-4303-9f97-61490a4b12ee',
    definisjonId: 'EN_ID',
    behandlingId: 'EN_ID',
    opprettet: '2020-01-01',
    kode: 'RV_MV_1',
    tittel: 'Vurder lovvalg og medlemskap',
    forklaring: 'Medlemskapssjekken har ikke klart å entydig konkludere med at bruker er medlem',
    handling: 'Sjekk om personen er medlem i folketrygden',
    vurdering: null,
};
