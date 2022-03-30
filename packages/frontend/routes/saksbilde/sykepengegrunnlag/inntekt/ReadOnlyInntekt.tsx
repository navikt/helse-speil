import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Flex } from '@components/Flex';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { getMonthName, somPenger } from '@utils/locale';
import { sorterInntekterFraAOrdningenNy } from '@utils/inntekt';
import { Inntektskilde, OmregnetArsinntekt } from '@io/graphql';

import styles from './ReadOnlyInntekt.module.css';

interface InntektFraAordningenProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
}

const ArbeidsgiverUtenSykefraværContainer = styled.div`
    display: flex;
    margin-top: 42px;
    font-size: 14px;
    line-height: 20px;
`;

const SortInfoikonContainer = styled(SortInfoikon)`
    margin-right: 16px;
`;

const InntektFraAordningen: React.VFC<InntektFraAordningenProps> = ({ omregnetÅrsinntekt }) => {
    return (
        <>
            <Flex alignItems="center">
                <h3 className={styles.Title}>RAPPORTERT SISTE 3 MÅNEDER</h3>
                <PopoverHjelpetekst className={styles.InfoIcon} ikon={<SortInfoikon />}>
                    <p>
                        Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekter fra A-ordningen
                        til grunn
                    </p>
                </PopoverHjelpetekst>
            </Flex>
            <div className={styles.Grid}>
                {sorterInntekterFraAOrdningenNy(omregnetÅrsinntekt.inntektFraAOrdningen)?.map((inntekt, i) => (
                    <React.Fragment key={i}>
                        <BodyShort> {getMonthName(inntekt.maned)}</BodyShort>
                        <BodyShort>{somPenger(inntekt.sum)}</BodyShort>
                    </React.Fragment>
                ))}
            </div>
            <hr className={styles.Divider} />
            <div className={styles.Grid}>
                <BodyShort>Gj.snittlig månedsinntekt</BodyShort>
                <BodyShort>{somPenger(omregnetÅrsinntekt.manedsbelop)}</BodyShort>
                <Bold>Omregnet rapportert årsinntekt</Bold>
                <Bold>{somPenger(omregnetÅrsinntekt.belop)}</Bold>
            </div>
            <div className={styles.ArbeidsforholdInfoText}>
                <SortInfoikon />
                <p>
                    Arbeidsforholdet er tatt med i beregningsgrunnlaget fordi det er <br />
                    innrapportert inntekt og/eller fordi arbeidsforholdet har startdato i <br />
                    løpet av de to siste månedene før skjæringstidspunktet.
                </p>
            </div>
        </>
    );
};

interface ReadOnlyInntektProps {
    omregnetÅrsinntekt?: OmregnetArsinntekt | null;
}

export const ReadOnlyInntekt = ({ omregnetÅrsinntekt }: ReadOnlyInntektProps) => (
    <>
        {omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen ? (
            <InntektFraAordningen omregnetÅrsinntekt={omregnetÅrsinntekt!} />
        ) : (
            <div className={styles.Grid}>
                <BodyShort>Månedsbeløp</BodyShort>
                <BodyShort>{somPenger(omregnetÅrsinntekt?.manedsbelop)}</BodyShort>
                <Bold>
                    {omregnetÅrsinntekt?.kilde === Inntektskilde.Infotrygd
                        ? 'Sykepengegrunnlag før 6G'
                        : 'Omregnet til årsinntekt'}
                </Bold>
                <Bold>{somPenger(omregnetÅrsinntekt?.belop)}</Bold>
            </div>
        )}
    </>
);
