import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { VarselMedHandling } from './VarselMedHandling';

describe('VarselMedHandling', () => {
    it('ekspanderer ved klikk på tittelen', async () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="aktiv" />);

        await userEvent.click(screen.getByText('Et varsel'));

        expect(chevron()).toHaveAttribute('aria-expanded', 'true');
    });

    it('ekspanderer ikke ved klikk i kolonnen rundt Vurder-knappen', async () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="aktiv" />);
        const avhuking = screen.getByRole('button', { name: 'Vurdert' });

        await userEvent.click(avhuking.parentElement!);

        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('ekspanderer ikke ved klikk på deaktivert Vurder-knapp', async () => {
        render(
            <VarselMedHandling
                varsel={lagVarsel({
                    ident: 'A123456',
                    status: ApiSaksbildeVarselstatus.GODKJENT,
                    tidsstempel: '2020-01-02T10:00:00',
                })}
                type="ferdig-behandlet"
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Vurdert' }));

        expect(chevron()).toHaveAttribute('aria-expanded', 'false');
    });

    it('viser vurderingsstatus med aria-pressed', () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="aktiv" />);

        expect(screen.getByRole('button', { name: 'Vurdert' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('viser feil-varsel som ikon, ikke knapp', () => {
        render(<VarselMedHandling varsel={lagVarsel(null)} type="feil" />);

        expect(screen.getByRole('img', { name: 'Feil' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurdert' })).not.toBeInTheDocument();
    });
});

function chevron() {
    return screen.getByRole('button', { name: 'Detaljer' });
}

function lagVarsel(vurdering: ApiVarselDTO['vurdering']): ApiVarselDTO {
    return {
        id: '61b4e00e-497b-4454-ba9b-c59cda9a462f',
        definisjonId: 'EN_ID',
        behandlingId: 'EN_ID',
        opprettet: '2020-01-01',
        kode: 'EN_KODE',
        tittel: 'Et varsel',
        forklaring: 'Forklaring',
        handling: 'Handling',
        vurdering,
    };
}
