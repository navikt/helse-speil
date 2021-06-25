import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { Person } from 'internal-types';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Feilmelding as NavFeilmelding, Normaltekst } from 'nav-frontend-typografi';

import { Modal } from '../../../../components/Modal';
import { postAbonnerPåAktør, postAnnullering } from '../../../../io/http';
import { AnnulleringDTO } from '../../../../io/types';
import { opptegnelsePollingTimeState } from '../../../../state/opptegnelser';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { somPenger } from '../../../../utils/locale';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';
import { Annulleringsvarsel } from './Annulleringsvarsel';

const ModalContainer = styled(Modal)`
    max-width: 48rem;

    .skjemaelement__feilmelding {
        font-style: normal;
    }
`;

const Form = styled.form`
    padding: 0.5rem 2.5rem 2.5rem;
`;

const Tittel = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--navds-color-text-primary);
    margin-bottom: 1.5rem;
`;

const AnnullerKnapp = styled(Knapp)`
    margin-right: 1rem;
`;

const Feilmelding = styled(NavFeilmelding)`
    margin-top: 0.625rem;
`;

const TilAnnullering = styled.div`
    margin: 1.5rem 0 0 2rem;
`;

const Utbetalingsgruppe = styled.div`
    margin-bottom: 2rem;
`;

export interface Annulleringslinje {
    fom: Dayjs;
    tom: Dayjs;
    dagsats?: number;
}

interface AnnulleringsmodalProps {
    person: Person;
    organisasjonsnummer: string;
    fagsystemId: string;
    linjer: Annulleringslinje[];
    onClose: () => void;
    onSuccess?: () => void;
}

export const Annulleringsmodal = ({
    person,
    organisasjonsnummer,
    fagsystemId,
    linjer,
    onClose,
    onSuccess,
}: AnnulleringsmodalProps) => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const form = useForm({ mode: 'onBlur' });
    const kommentar = form.watch('kommentar');
    const begrunnelser = form.watch(`begrunnelser`);
    const annenBegrunnelse = begrunnelser ? begrunnelser.includes('annet') : false;
    const harMinstÉnBegrunnelse = () => begrunnelser?.length > 0 ?? true;

    const annullering = (): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        fagsystemId: fagsystemId,
        begrunnelser: begrunnelser,
        kommentar: kommentar ? (kommentar.trim() === '' ? undefined : kommentar.trim()) : undefined,
    });

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        if (annenBegrunnelse && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger begrunnelsen annet',
            });
        } else if (!harMinstÉnBegrunnelse()) {
            form.setError('begrunnelser', {
                type: 'manual',
                message: 'Velg minst én begrunnelse',
            });
        } else {
            setIsSending(true);
            setPostAnnulleringFeil(undefined);
            postAnnullering(annullering)
                .then(() => {
                    postAbonnerPåAktør(annullering.aktørId).then(() => {
                        setOpptegnelsePollingTime(1000);
                    });
                    onSuccess && onSuccess();
                    onClose();
                })
                .catch(() => setPostAnnulleringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.'))
                .finally(() => setIsSending(false));
        }
    };

    const submit = () => sendAnnullering(annullering());

    return (
        <FormProvider {...form}>
            <ModalContainer
                className="AnnulleringModal"
                isOpen={true}
                contentLabel="Feilmelding"
                onRequestClose={onClose}
            >
                <Form onSubmit={form.handleSubmit(submit)}>
                    <Annulleringsvarsel />
                    <Tittel>Annullering</Tittel>

                    <Utbetalingsgruppe>
                        <TilAnnullering>
                            <Normaltekst>Følgende utbetalinger annulleres:</Normaltekst>
                            <ul>
                                {linjer.map((linje, index) => (
                                    <li key={index}>
                                        {linje.fom.format(NORSK_DATOFORMAT)} - {linje.tom.format(NORSK_DATOFORMAT)}
                                        {linje.dagsats && ' - ' + somPenger(linje.dagsats)}
                                    </li>
                                ))}
                            </ul>
                        </TilAnnullering>
                    </Utbetalingsgruppe>

                    <Annulleringsbegrunnelse />
                    <AnnullerKnapp spinner={isSending} autoDisableVedSpinner>
                        Annuller
                    </AnnullerKnapp>
                    <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                    {postAnnulleringFeil && <Feilmelding>{postAnnulleringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
