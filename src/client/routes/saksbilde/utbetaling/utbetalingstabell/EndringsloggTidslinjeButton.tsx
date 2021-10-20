import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import '@navikt/helse-frontend-tooltip/lib/main.css';

import { EndringsloggOverstyrteDager } from '../../../../components/EndringsloggOverstyrteDager';
import { useInteractOutside } from '../../../../hooks/useInteractOutside';

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

interface EndringsloggTidslinjeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: Dagoverstyring[];
}

export const EndringsloggTidslinjeButton: React.VFC<EndringsloggTidslinjeButtonProps> = ({
    endringer,
    className,
    ...buttonProps
}) => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleVisTooltip = () => setVisEndringslogg((prevState) => !prevState);

    useInteractOutside({
        ref: buttonRef,
        active: visEndringslogg,
        onInteractOutside: toggleVisTooltip,
    });

    return (
        <Button
            type="button"
            ref={buttonRef}
            onClick={() => setVisEndringslogg((value) => !value)}
            className={className}
            {...buttonProps}
        >
            <CaseworkerFilled height={20} width={20} />
            <EndringsloggOverstyrteDager
                endringer={endringer}
                isOpen={visEndringslogg}
                onRequestClose={() => setVisEndringslogg(false)}
            />
        </Button>
    );
};
