import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

import { BodyShort } from '@navikt/ds-react';

import { getFormatertNavn, useAktørIdRender, useEnhetRender, usePersoninfoRender } from '../state/person';
import { NORSK_DATOFORMAT } from '../utils/date';
import { capitalizeName } from '../utils/locale';

import { utbetalingsoversikt } from '../featureToggles';
import { Bold } from './Bold';
import { Clipboard } from './clipboard';
import { KjønnsnøytraltIkon } from './ikoner/KjønnsnøytraltIkon';
import { Kvinneikon } from './ikoner/Kvinneikon';
import { Manneikon } from './ikoner/Manneikon';

const formatFnr = (fnr: string) => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const Container = styled.div`
    grid-area: personlinje;
    display: flex;
    align-items: center;
    height: 48px;
    box-sizing: border-box;
    padding: 0 2rem;
    background: var(--speil-background-secondary);
    border-bottom: 1px solid var(--navds-color-border);
    color: var(--navds-color-text-primary);

    > svg {
        margin-right: 0.5rem;
    }
`;

const Separator = styled(BodyShort)`
    margin: 0 1rem;
`;

const Lenke = styled(Link)`
    color: inherit;

    &:hover {
        text-decoration: none;
    }

    &:active,
    &:focus-visible {
        outline: none;
        color: var(--navds-color-text-inverse);
        text-decoration: none;
        background-color: var(--navds-text-focus);
        box-shadow: 0 0 0 2px var(--navds-text-focus);
    }
`;

const Etikett = styled.div`
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    width: max-content;
`;

const DødsdatoEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-it-background);
    border: 1px solid var(--speil-etikett-forlengelse-it-border);
    color: var(--navds-color-text-inverse);
`;

const Kjønnsikon = ({ kjønn }: { kjønn: 'kvinne' | 'mann' | 'ukjent' }) => {
    switch (kjønn.toLowerCase()) {
        case 'kvinne':
            return <Kvinneikon alt="Kvinne" />;
        case 'mann':
            return <Manneikon alt="Mann" />;
        default:
            return <KjønnsnøytraltIkon alt="Ukjent" />;
    }
};

const LoadingText = styled.div`
    @keyframes placeHolderShimmer {
        0% {
            background-position: -468px 0;
        }
        100% {
            background-position: 468px 0;
        }
    }

    animation-duration: 1.25s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: transparent;
    background: linear-gradient(to right, transparent 0%, #eaeaea 16%, transparent 33%);
    background-size: 800px 104px;
    border-radius: 4px;
    height: 22px;
    width: 150px;
    margin: 4px 0;
`;

export const LasterPersonlinje = () => (
    <Container className="Personlinje">
        <KjønnsnøytraltIkon />
        <LoadingText />
        <Separator as="p">/</Separator>
        <LoadingText />
        <Separator as="p">/</Separator>
        <LoadingText />
        <Separator as="p">/</Separator>
        <LoadingText />
        <Separator as="p">/</Separator>
        <LoadingText />
    </Container>
);

interface PersonlinjeProps {
    dødsdato?: Dayjs;
}

export const Personlinje = ({ dødsdato }: PersonlinjeProps) => {
    const personinfo = usePersoninfoRender();
    const personnavn = getFormatertNavn(personinfo, ['E', ',', 'F', 'M']);
    const aktørId = useAktørIdRender();
    const enhet = useEnhetRender();

    return (
        <Container className="Personlinje">
            <Kjønnsikon kjønn={personinfo.kjønn} />
            <Bold>
                {capitalizeName(personnavn)}
                {personinfo.fødselsdato !== null && ` (${dayjs().diff(personinfo.fødselsdato, 'year')} år)`}
            </Bold>
            <Separator as="p">/</Separator>
            {personinfo.fnr ? (
                <Clipboard
                    preserveWhitespace={false}
                    copyMessage="Fødselsnummer er kopiert"
                    dataTip="Kopier fødselsnummer"
                >
                    <BodyShort>{formatFnr(personinfo.fnr)}</BodyShort>
                </Clipboard>
            ) : (
                <BodyShort>Fødselsnummer ikke tilgjengelig</BodyShort>
            )}
            <Separator as="p">/</Separator>
            <BodyShort>Aktør-ID:&nbsp;</BodyShort>
            <Clipboard preserveWhitespace={false} copyMessage="Aktør-ID er kopiert" dataTip="Kopier aktør-ID">
                <BodyShort>{aktørId}</BodyShort>
            </Clipboard>
            <Separator as="p">/</Separator>
            <BodyShort>
                Boenhet: {enhet.id} ({enhet.navn})
            </BodyShort>
            {utbetalingsoversikt && (
                <>
                    <Separator as="p">/</Separator>
                    <Lenke to={`${aktørId}/../utbetalingshistorikk`}>Utbetalingsoversikt</Lenke>
                </>
            )}
            {dødsdato && (
                <>
                    <Separator as="p">/</Separator>
                    <DødsdatoEtikett>Død {dødsdato?.format(NORSK_DATOFORMAT)}</DødsdatoEtikett>
                </>
            )}
        </Container>
    );
};
