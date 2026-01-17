import React from 'react';
import { Mock } from 'vitest';

import { useGetKrrStatusForPerson } from '@io/rest/generated/krr/krr';
import { render, screen } from '@testing-library/react';

import { ReservasjonTag } from './ReservasjonTag';

vi.mock('@io/rest/generated/krr/krr');

describe('ReservasjonTag', () => {
    it('rendrer tag når det ikke finnes reservasjonsstatus', async () => {
        (useGetKrrStatusForPerson as Mock).mockReturnValueOnce({ data: {} });
        render(<ReservasjonTag />);
        expect(await screen.findByText('Status KRR utilgjengelig')).toBeVisible();
    });
    it('rendrer tag når det finnes en reservasjon i KRR', async () => {
        (useGetKrrStatusForPerson as Mock).mockReturnValueOnce({
            data: { data: { kanVarsles: false, reservert: true } },
        });
        render(<ReservasjonTag />);
        expect(await screen.findByText('Reservert KRR')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes en reservasjon i KRR', async () => {
        (useGetKrrStatusForPerson as Mock).mockReturnValueOnce({
            data: { data: { kanVarsles: true, reservert: false } },
        });
        render(<ReservasjonTag />);
        expect(screen.queryByText('Reservert KRR')).not.toBeInTheDocument();
        expect(screen.queryByText('Ikke registrert KRR')).not.toBeInTheDocument();
        expect(screen.queryByText('Status KRR utilgjengelig')).not.toBeInTheDocument();
    });
});
