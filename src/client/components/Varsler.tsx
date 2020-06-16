import GeneriskVarsel from '@navikt/helse-frontend-varsel';
import { Varsel as Vaffel, varslerForScope } from '../state/varslerState';
import styled from '@emotion/styled';
import React from 'react';
import { useRecoilValue } from 'recoil';

const Separator = styled.span`
    margin-left: 1rem;
    margin-right: 1rem;
`;
const Varsel = ({ varsel }: { varsel?: Vaffel }) => {
    if (!varsel) return null;
    return (
        <GeneriskVarsel type={varsel.type}>
            {varsel.message}
            {varsel.technical && (
                <>
                    <Separator>|</Separator>
                    {varsel.technical}
                </>
            )}
        </GeneriskVarsel>
    );
};

export const Varsler = () => {
    const varsler = useRecoilValue(varslerForScope);
    return (
        <>
            {varsler.map((varsel) => (
                <Varsel key={varsel.message} varsel={varsel} />
            ))}
        </>
    );
};
