import React from 'react';
import { Varsel } from '@navikt/helse-frontend-varsel';
import { useRecoilValue } from 'recoil';
import { varslerForScope } from '../state/varslerState';
import styled from '@emotion/styled';

const Separator = styled.span`
    margin-left: 1rem;
    margin-right: 1rem;
`;

export const Varsler = () => (
    <>
        {useRecoilValue(varslerForScope)
            .filter((it) => it)
            .map(({ type, message, technical }) => (
                <Varsel type={type}>
                    {message}
                    {technical && (
                        <>
                            <Separator>|</Separator>
                            {technical}
                        </>
                    )}
                </Varsel>
            ))}
    </>
);
