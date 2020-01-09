import React, { useCallback, useContext, useEffect } from 'react';
import Oversiktslinje from './Oversiktslinje';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Panel } from 'nav-frontend-paneler';
import { useHistory } from 'react-router';
import { TildelingerContext } from '../../context/TildelingerContext';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import 'nav-frontend-lenker-style';
import './Oversikt.less';
import { buildLinks, pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { useInterval } from '../../hooks/useInterval';
import { Behov, Person } from '../../context/types';
import { useTranslation } from 'react-i18next';

const TWO_MINUTES = 120000;

const Oversikt = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const { hentPerson } = useContext(PersonContext);
    const {
        saksoversikt,
        hentSaksoversikt,
        isFetchingSaksoversikt,
        isFetchingPersoninfo
    } = useContext(SaksoversiktContext);
    const {
        tildelBehandling,
        tildelinger,
        tildelingError,
        fetchTildelinger,
        fjernTildeling
    } = useContext(TildelingerContext);

    useEffect(() => {
        hentSaksoversikt();
    }, []);

    const intervalledFetchTildelinger = useCallback(() => fetchTildelinger(saksoversikt), [saksoversikt]);
    useInterval({ callback: intervalledFetchTildelinger, interval: TWO_MINUTES });

    const velgBehovAndNavigate = (behov: Behov) => {
        hentPerson(behov.aktørId).then((person: Person) => {
            history.push(buildLinks(person)[pages.SYKMELDINGSPERIODE]);
        });
    };

    return (
        <div className="Oversikt">
            {tildelingError && <AlertStripeAdvarsel>{tildelingError}</AlertStripeAdvarsel>}
            <div className="Oversikt__container">
                <Panel border className="Oversikt__neste-behandlinger">
                    <Undertittel className="panel-tittel">{t('oversikt.tittel')}</Undertittel>
                    {isFetchingSaksoversikt && (
                        <AlertStripeInfo>
                            Henter personer <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    {isFetchingPersoninfo && (
                        <AlertStripeInfo>
                            Henter navn <NavFrontendSpinner type="XS" />
                        </AlertStripeInfo>
                    )}
                    <ul>
                        <li className="row">
                            <Normaltekst>{t('oversikt.søker')}</Normaltekst>
                            <Normaltekst>{t('oversikt.tidspunkt')}</Normaltekst>
                            <Normaltekst>{t('oversikt.tildeling')}</Normaltekst>
                        </li>
                        {saksoversikt.map((behov: Behov) => {
                            const tildeling = tildelinger.find(t => t.behovId === behov['@id']);
                            return (
                                <Oversiktslinje
                                    behov={behov}
                                    tildeling={tildeling}
                                    onAssignCase={tildelBehandling}
                                    onUnassignCase={fjernTildeling}
                                    onSelectCase={velgBehovAndNavigate}
                                    key={behov['@id']}
                                />
                            );
                        })}
                    </ul>
                </Panel>
            </div>
        </div>
    );
};

export default Oversikt;
