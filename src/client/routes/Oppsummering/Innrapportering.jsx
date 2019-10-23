import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import Kommentarer from './Kommentarer';
import Icon from 'nav-frontend-ikoner-assets';
import { AuthContext } from '../../context/AuthContext';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { putFeedback } from '../../io/http';
import { oppsummeringstekster } from '../../tekster';
import { Checkbox } from 'nav-frontend-skjema';
import { withRouter } from 'react-router';
import './Innrapportering.less';
import Uenigheter from './Uenigheter';
import ReactTooltip from 'react-tooltip';

const Innrapportering = ({ history }) => {
    const { personTilBehandling } = useContext(BehandlingerContext);
    const innrapportering = useContext(InnrapporteringContext);
    const authContext = useContext(AuthContext);
    const [error, setError] = useState(undefined);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (innrapportering.kommentarer !== '' || innrapportering.godkjent) {
            setError(undefined);
        }
    }, [innrapportering.kommentarer, innrapportering.godkjent]);

    const sendRapporter = () => {
        setIsSending(true);
        putFeedback({
            id: personTilBehandling.behandlingsId,
            txt: JSON.stringify({
                uenigheter: innrapportering.uenigheter,
                kommentarer: innrapportering.kommentarer,
                godkjent: innrapportering.godkjent,
                submittedDate: moment().format(),
                userId: {
                    ident: authContext.authInfo.ident,
                    email: authContext.authInfo.email
                }
            })
        })
            .then(() => {
                setError(undefined);
                innrapportering.setHasSendt(true);
                setTimeout(() => history.push('/'), 1000);
            })
            .catch(e => {
                const message =
                    e.statusCode === 401
                        ? 'Du må logge inn på nytt for å kunne sende rapport. Du vil sendes tilbake til forsiden etter innlogging og beholder arbeidet du har gjort.'
                        : 'Feil ved innsending av rapport. Prøv igjen senere.';
                setError({
                    ...e,
                    message
                });
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    const validateAndSend = () => {
        if (
            innrapportering.uenigheter.length > 0 ||
            innrapportering.kommentarer !== '' ||
            innrapportering.godkjent
        ) {
            sendRapporter();
        } else {
            setError({
                message: 'Huk av for at du er enig med maskinen dersom du ikke har noen kommentarer'
            });
        }
    };

    return (
        <Panel className="Innrapportering">
            <Undertittel>{oppsummeringstekster('innrapportert')}</Undertittel>
            <Uenigheter uenigheter={innrapportering.uenigheter} />
            <Kommentarer />
            <ReactTooltip html={true} place="bottom" />
            <div
                data-html={true}
                data-tip={'<p class="typo-normal">Du er uenig med maskinen</p>'}
                data-tip-disable={innrapportering.uenigheter.length === 0}
            >
                <Checkbox
                    defaultChecked={innrapportering.godkjent}
                    onChange={e => innrapportering.setGodkjent(e.target.checked)}
                    label="Jeg er enig med maskinen"
                    disabled={innrapportering.uenigheter.length > 0}
                />
            </div>
            {innrapportering.hasSendt ? (
                <Knapp className="sendt" disabled>
                    Rapport mottatt
                    <Icon kind="ok-sirkel-fyll" size={20} />
                </Knapp>
            ) : (
                <Knapp onClick={validateAndSend} spinner={isSending}>
                    Send inn
                </Knapp>
            )}
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.message}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </Normaltekst>
            )}
        </Panel>
    );
};

Innrapportering.propTypes = {
    history: PropTypes.shape({ push: PropTypes.func })
};

export default withRouter(Innrapportering);
