import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import '@navikt/helse-frontend-tooltip/lib/main.css';

import { Endringslogg } from '../../../../components/Endringslogg';
import { useInteractOutside } from '../../../../hooks/useInteractOutside';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { Dagoverstyring } from './Utbetalingstabell.types';

const Overstyringknapp = styled.button`
    position: relative;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    width: 28px;
    display: flex;
    justify-content: center;
    outline: none;
`;

interface OverstyringsindikatorProps {
    overstyringer: Dagoverstyring[];
}

export const OverstyringsindikatorSaksbehandler = ({ overstyringer }: OverstyringsindikatorProps) => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleVisTooltip = () => setVisEndringslogg((prevState) => !prevState);

    useInteractOutside({
        ref: buttonRef,
        active: visEndringslogg,
        onInteractOutside: toggleVisTooltip,
    });

    return (
        <Overstyringknapp type="button" ref={buttonRef} onClick={() => setVisEndringslogg((value) => !value)}>
            <CaseworkerFilled height={20} width={20} />
            {visEndringslogg && (
                <Endringslogg
                    isOpen
                    contentLabel="Endringslogg"
                    title="Endringslogg"
                    onRequestClose={() => setVisEndringslogg(false)}
                >
                    <thead>
                        <tr>
                            <th>Dato</th>
                            <th>Kilde</th>
                            <th>Kommentar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overstyringer.map(({ timestamp, navn, begrunnelse }, i) => (
                            <tr key={i}>
                                <td>{timestamp.format(NORSK_DATOFORMAT)}</td>
                                <td>{navn}</td>
                                <td>{begrunnelse}</td>
                            </tr>
                        ))}
                    </tbody>
                </Endringslogg>
            )}
        </Overstyringknapp>
    );
};
