import React, { useContext } from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { useTranslation } from 'react-i18next';
import Inntektssammenligning from './Inntektssammenligning';
import Avvikssammenligning from './Avvikssammenligning';
import { somPenger } from '../../utils/locale';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import styled from '@emotion/styled';

const Innhold = styled.div`
    width: max-content;
    padding: 2rem 2rem;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #e7e9e9;
    margin-bottom: 2rem;
`;

const Oppsummering = styled.div`
    display: grid;
    grid-template-columns: 15rem max-content;

    > * {
        margin-bottom: 3rem;
    }
`;

const Sykepengegrunnlag = () => {
    const { sykepengegrunnlag } = useContext(PersonContext).aktivVedtaksperiode!;
    const { t } = useTranslation();

    return (
        <Innhold>
            {sykepengegrunnlag && (
                <>
                    <Inntektssammenligning
                        inntektskilde="Arbeidsgiver"
                        årsinntektAordning={sykepengegrunnlag.årsinntektFraAording}
                        årsinntektInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                    />

                    <Divider />

                    {sykepengegrunnlag.avviksprosent !== undefined &&
                    sykepengegrunnlag.avviksprosent !== null
                        ? sykepengegrunnlag.årsinntektFraAording && (
                              <>
                                  <Avvikssammenligning
                                      avvik={sykepengegrunnlag.avviksprosent}
                                      totalOmregnetÅrsinntekt={
                                          sykepengegrunnlag.årsinntektFraInntektsmelding!
                                      }
                                      totalRapportertÅrsinntekt={
                                          sykepengegrunnlag.årsinntektFraAording
                                      }
                                  />
                                  <Divider />
                              </>
                          )
                        : null}
                    <Oppsummering>
                        <Element>Sykepengegrunnlag</Element>
                        <Element>
                            {somPenger(
                                sykepengegrunnlag.årsinntektFraInntektsmelding as number | undefined
                            )}
                        </Element>
                        <Normaltekst>Dagsats</Normaltekst>
                        <Normaltekst>{somPenger(sykepengegrunnlag.dagsats)}</Normaltekst>
                    </Oppsummering>
                </>
            )}
            <Navigasjonsknapper previous={pages.INNTEKTSKILDER} next={pages.UTBETALINGSOVERSIKT} />
        </Innhold>
    );
};

export default Sykepengegrunnlag;
