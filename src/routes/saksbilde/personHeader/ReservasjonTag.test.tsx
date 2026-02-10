import React from 'react';
import { Mock } from 'vitest';

import { useGetKrrRegistrertStatusForPerson } from '@io/rest/generated/krr/krr';
import { ApiKrrRegistrertStatus } from '@io/rest/generated/spesialist.schemas';
import { render, screen } from '@testing-library/react';

import { ReservasjonTag } from './ReservasjonTag';

vi.mock('@io/rest/generated/krr/krr');

describe('ReservasjonTag', () => {
    it('rendrer tag når det feiler å hente status fra KRR', async () => {
        (useGetKrrRegistrertStatusForPerson as Mock).mockReturnValueOnce({ data: undefined });
        render(<ReservasjonTag />);
        expect(await screen.findByText('Status KRR utilgjengelig')).toBeVisible();
    });
    it('rendrer tag når personen har reservert seg i KRR', async () => {
        (useGetKrrRegistrertStatusForPerson as Mock).mockReturnValueOnce({
            data: ApiKrrRegistrertStatus.RESERVERT_MOT_DIGITAL_KOMMUNIKASJON_ELLER_VARSLING,
        });
        render(<ReservasjonTag />);
        expect(await screen.findByText('Reservert KRR')).toBeVisible();
    });
    it('rendrer tag når personen ikke ligger i KRR', async () => {
        (useGetKrrRegistrertStatusForPerson as Mock).mockReturnValueOnce({
            data: ApiKrrRegistrertStatus.IKKE_REGISTRERT_I_KRR,
        });
        render(<ReservasjonTag />);
        expect(await screen.findByText('Ikke registrert KRR')).toBeVisible();
    });
    it('rendrer ikke tag når personen ikke har reservert seg i KRR', async () => {
        (useGetKrrRegistrertStatusForPerson as Mock).mockReturnValueOnce({
            data: ApiKrrRegistrertStatus.IKKE_RESERVERT_MOT_DIGITAL_KOMMUNIKASJON_ELLER_VARSLING,
        });
        render(<ReservasjonTag />);
        expect(screen.queryByText('Reservert KRR')).not.toBeInTheDocument();
        expect(screen.queryByText('Ikke registrert KRR')).not.toBeInTheDocument();
        expect(screen.queryByText('Status KRR utilgjengelig')).not.toBeInTheDocument();
    });
});
