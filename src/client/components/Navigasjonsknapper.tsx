import React from 'react';
import styled from '@emotion/styled';
import { Knapp } from 'nav-frontend-knapper';
import { useNavigation } from '../hooks/useNavigation';
import { Key, useKeyboard } from '../hooks/useKeyboard';
import classNames from 'classnames';

const Container = styled.div`
    margin: 2.5rem 0 0;
    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

export const Navigasjonsknapper: React.FC<any> = ({ className }) => {
    const { navigateToNext, navigateToPrevious } = useNavigation();

    const clickPrevious = () => navigateToPrevious?.();

    const clickNext = () => navigateToNext?.();

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true },
    });

    return (
        <Container className={classNames(className, 'Navigasjonsknapper')}>
            <Knapp disabled={!navigateToPrevious} onClick={clickPrevious}>
                FORRIGE
            </Knapp>
            <Knapp disabled={!navigateToNext} onClick={clickNext}>
                NESTE
            </Knapp>
        </Container>
    );
};
