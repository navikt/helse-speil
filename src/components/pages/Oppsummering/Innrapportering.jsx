import React, { useContext, useState } from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { putFeedback } from '../../../io/http';
import './Innrapportering.less';

const Innrapportering = withBehandlingContext(({ behandling }) => {
    const innrapportering = useContext(InnrapporteringContext);
    const [error, setError] = useState(undefined);
    const [isSending, setIsSending] = useState(false);

    const sendRapporter = () => {
        setIsSending(true);
        putFeedback({
            id: behandling.behandlingsId,
            txt: JSON.stringify(
                innrapportering.uenigheter.map(uenighet => ({
                    label: uenighet.label,
                    value: uenighet.value
                }))
            )
        })
            .then(() => {
                setError(undefined);
            })
            .catch(() => {
                setError('Feil ved innsending av rapport. Prøv igjen senere.');
            })
            .finally(() => {
                setIsSending(false);
                innrapportering.setHasSendt(true);
            });
    };

    return (
        <Panel className="Innrapportering" border>
            <Undertittel>Innrapportert</Undertittel>
            {innrapportering.uenigheter.length === 0 ? (
                <Normaltekst>Ingen uenigheter</Normaltekst>
            ) : (
                <>
                    {innrapportering.uenigheter.map((uenighet, i) => (
                        <Normaltekst key={`uenighet-${i}`}>
                            {uenighet.label} - <span>{uenighet.value}</span>
                        </Normaltekst>
                    ))}
                    <Knapp
                        className={innrapportering.hasSendt ? 'sendt' : ''}
                        onClick={
                            innrapportering.hasSendt ? undefined : sendRapporter
                        }
                        spinner={isSending}
                        disabled={innrapportering.hasSendt}
                    >
                        {innrapportering.hasSendt ? (
                            <>
                                Rapport mottatt
                                <Icon kind="ok-sirkel-fyll" size={20} />
                            </>
                        ) : (
                            <>Send inn</>
                        )}
                    </Knapp>
                    {error && (
                        <Normaltekst className="skjemaelement__feilmelding">
                            {error}
                        </Normaltekst>
                    )}
                </>
            )}
        </Panel>
    );
});

export default Innrapportering;
