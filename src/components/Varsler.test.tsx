import React, { useEffect } from 'react';
import { Mock } from 'vitest';

import { Varsler } from '@components/Varsler';
import { TildelingAlert } from '@state/oppgaver';
import { useFetchPersonQuery } from '@state/person';
import { useAddVarsel } from '@state/varsler';
import { render, screen } from '@test-utils';
import { InfoAlert } from '@utils/error';

vi.mock('@state/person');

describe('Varsler', () => {
    beforeEach(() => {
        (useFetchPersonQuery as Mock).mockReturnValue({});
    });

    it('merker navnet på tildelt saksbehandler som sensitivt', () => {
        render(<VarslerMed varsel={new TildelingAlert('Kari Saksbehandler')} />);

        expect(screen.getByText('Kari Saksbehandler')).toHaveAttribute('data-sensitive');
        expect(screen.getByText(/Oppgaven er tildelt/)).not.toHaveAttribute('data-sensitive');
    });

    it('viser andre varsler som ren tekst', () => {
        render(<VarslerMed varsel={new InfoAlert('Et vanlig varsel')} />);

        expect(screen.getByText('Et vanlig varsel')).not.toHaveAttribute('data-sensitive');
    });
});

function VarslerMed({ varsel }: { varsel: InfoAlert }) {
    const addVarsel = useAddVarsel();

    useEffect(() => {
        addVarsel(varsel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Varsler />;
}
