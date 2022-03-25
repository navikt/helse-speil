import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';
import { CaseworkerFilled } from '@navikt/ds-icons';

import { EndringsloggDager } from '@components/EndringsloggDager';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { Dagoverstyring, Dagtype } from '@io/graphql';

const Button = styled.button`
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

const tilOverstyrtDagtype = (type: Utbetalingstabelldagtype): Dagtype => {
    switch (type) {
        case 'Ferie':
            return Dagtype.Feriedag;
        case 'Egenmelding':
            return Dagtype.Egenmeldingsdag;
        case 'Permisjon':
            return Dagtype.Permisjonsdag;
        case 'Syk':
        default:
            return Dagtype.Sykedag;
    }
};

const tilDagoverstyring = (dato: DateString, overstyringer: Array<OverstyringerPrDag>): Dagoverstyring => {
    const dager = overstyringer.map((it) => ({
        dato: dato,
        type: tilOverstyrtDagtype(it.type),
        grad: it.grad,
    }));

    const { begrunnelse, saksbehandler, timestamp } = overstyringer[0];

    return {
        begrunnelse,
        saksbehandler,
        timestamp,
        dager,
    } as Dagoverstyring;
};

interface EndringsloggTidslinjeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    dato: DateString;
    endringer: Array<OverstyringerPrDag>;
}

export const EndringsloggTidslinjeButton: React.VFC<EndringsloggTidslinjeButtonProps> = ({
    dato,
    endringer,
    className,
    ...buttonProps
}) => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const close = () => setVisEndringslogg(false);

    useInteractOutside({
        ref: buttonRef,
        active: visEndringslogg,
        onInteractOutside: close,
    });

    if (endringer.length === 0) {
        return null;
    }

    return (
        <>
            <Button
                type="button"
                className={className}
                ref={buttonRef}
                {...buttonProps}
                onClick={() => setVisEndringslogg(true)}
            >
                <CaseworkerFilled height={20} width={20} />
            </Button>
            <EndringsloggDager endringer={endringer} isOpen={visEndringslogg} onRequestClose={close} />
        </>
    );
};
