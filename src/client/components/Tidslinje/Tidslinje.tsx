import React, { ChangeEvent, useContext, useMemo } from 'react';
import styled from '@emotion/styled';
import { PersonContext } from '../../context/PersonContext';
import { Sykepengetidslinje } from '@navikt/helse-frontend-tidslinje';
import Vinduvelger from './Vinduvelger';
import { useTidslinjevinduer } from './useTidslinjevinduer';
import { useTidslinjerader } from './useTidslinjerader';
import Arbeidsgiverikon from '../Ikon/Arbeidsgiverikon';
import { useIntervaller } from './useIntervaller';
import dayjs from 'dayjs';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Select } from '../Select';
import { useInfotrygdrader } from './useInfotrygdrader';
import Infotrygdikon from '../Ikon/Infotrygdikon';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    border-bottom: 1px solid #c6c2bf;
`;

const FlexRow = styled.div`
    display: flex;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const SelectContainer = styled.div`
    padding-top: 12px;
    height: 44px;
    width: 250px;
`;

const Labels = styled.div`
    padding: 14px 0;
`;

const Radnavn = styled.p`
    height: 24px;
    margin: 0.25rem 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #3e3832;

    > svg {
        margin-right: 10px;
    }
`;

const Dinosaur = styled.span`
    width: 1rem;
    height: 1rem;
    margin-right: 0.625rem;
`;

export const Tidslinje = () => {
    const { personTilBehandling, aktiverVedtaksperiode, aktivVedtaksperiode } = useContext(PersonContext);
    const { vinduer, aktivtVindu, setAktivtVindu } = useTidslinjevinduer(personTilBehandling);
    const arbeidsgiverrader = useTidslinjerader(personTilBehandling, aktivVedtaksperiode);
    const infotrygdrader = useInfotrygdrader(personTilBehandling);
    const tidslinjerader = [...arbeidsgiverrader, ...infotrygdrader];
    const intervaller = useIntervaller(arbeidsgiverrader);
    const aktivtIntervall = intervaller.find(intervall => intervall.active);
    const radnavnArbeidsgiver =
        personTilBehandling?.arbeidsgivere.map(arbeidsgiver => arbeidsgiver.navn ?? arbeidsgiver.organisasjonsnummer) ??
        [];

    const radnavnInfotrygd = infotrygdrader.flatMap(rad =>
        rad.organisasjonsnummer !== '0' ? `Infotrygd — ${rad.organisasjonsnummer}` : `Infotrygd — Søknad uten inntekt`
    );

    const onSelect = (periode: { id?: string }) => {
        aktiverVedtaksperiode(periode.id!);
    };

    const onChange = (event: ChangeEvent<HTMLOptionElement>) => {
        const intervallet = intervaller.find(i => i.id === event.target.value)!;
        const nyPeriode = tidslinjerader
            .flatMap(rad => rad.perioder)
            .find(
                periode =>
                    periode.fom.getTime() === intervallet.fom.getTime() &&
                    periode.tom.getTime() === intervallet.tom.getTime()
            );
        aktiverVedtaksperiode(nyPeriode!.id);
    };

    return useMemo(() => {
        if (tidslinjerader.length === 0) return null;
        return (
            <Container>
                <FlexRow>
                    <FlexColumn>
                        <SelectContainer>
                            <Select name="tidslinjeintervaller" onChange={onChange} value={aktivtIntervall?.id}>
                                {intervaller.map(intervallet => (
                                    <option key={intervallet.id} value={intervallet.id}>
                                        {`${dayjs(intervallet.fom).format(NORSK_DATOFORMAT)} - ${dayjs(
                                            intervallet.tom
                                        ).format(NORSK_DATOFORMAT)}`}
                                    </option>
                                ))}
                            </Select>
                        </SelectContainer>
                        <Labels>
                            {radnavnArbeidsgiver.map((navn, i) => (
                                <Radnavn key={`tidslinjerad-${i}`}>
                                    <Arbeidsgiverikon />
                                    {navn}
                                </Radnavn>
                            ))}
                            {radnavnInfotrygd.map((navn, i) => (
                                <Radnavn key={`tidslinjerad-${i}`}>
                                    <Dinosaur>🦕</Dinosaur> {navn}
                                </Radnavn>
                            ))}
                        </Labels>
                    </FlexColumn>
                    <Sykepengetidslinje
                        rader={tidslinjerader}
                        startDato={vinduer[aktivtVindu].fom.toDate()}
                        sluttDato={vinduer[aktivtVindu].tom.toDate()}
                        onSelectPeriode={onSelect}
                    />
                </FlexRow>
                <Vinduvelger vinduer={vinduer} aktivtVindu={aktivtVindu} setAktivtVindu={setAktivtVindu} />
            </Container>
        );
    }, [tidslinjerader, intervaller, aktivtVindu]);
};
