import React, { useContext } from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { Person } from '../../context/types';
import { useTranslation } from 'react-i18next';
import Inntektssammenligning from './Inntektssammenligning';
import './Sykepengegrunnlag.less';
import ListSeparator from '../../components/ListSeparator';
import Avvikssammenligning from './Avvikssammenligning';
import { somPenger } from '../../utils/locale';
import { Element, Normaltekst } from 'nav-frontend-typografi';

const Sykepengegrunnlag = () => {
    const { sykepengegrunnlag } = useContext(PersonContext).personTilBehandling as Person;
    const { t } = useTranslation();

    return (
        <Panel className="tekstbolker Sykepengegrunnlag">
            {sykepengegrunnlag && (
                <>
                    <Inntektssammenligning
                        inntektskilde="Arbeidsgiver"
                        årsinntektAordning={sykepengegrunnlag.årsinntektFraAording}
                        årsinntektInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                    />
                    <ListSeparator />
                    {sykepengegrunnlag.avviksprosent && sykepengegrunnlag.årsinntektFraAording && (
                        <>
                            <Avvikssammenligning
                                avvik={sykepengegrunnlag.avviksprosent}
                                totalOmregnetÅrsinntekt={
                                    sykepengegrunnlag.årsinntektFraInntektsmelding!
                                }
                                totalRapportertÅrsinntekt={sykepengegrunnlag.årsinntektFraAording}
                            />
                            <ListSeparator />
                        </>
                    )}
                    <div className="Sykepengegrunnlag__oppsummering">
                        <Element>Sykepengegrunnlag</Element>
                        <Element>
                            {somPenger(
                                sykepengegrunnlag.årsinntektFraInntektsmelding as number | undefined
                            )}
                        </Element>
                        <Normaltekst>Dagsats</Normaltekst>
                        <Normaltekst>{somPenger(sykepengegrunnlag.dagsats)}</Normaltekst>
                    </div>
                </>
            )}
            <Navigasjonsknapper previous={pages.INNTEKTSKILDER} next={pages.UTBETALINGSOVERSIKT} />
        </Panel>
    );
};

export default Sykepengegrunnlag;
