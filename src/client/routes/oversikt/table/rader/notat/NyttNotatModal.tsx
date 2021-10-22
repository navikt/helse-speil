import styled from '@emotion/styled';
import React, { ChangeEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { BodyShort, Button, Loader, Textarea } from '@navikt/ds-react';

import { Modal } from '../../../../../components/Modal';
import { Key } from '../../../../../hooks/useKeyboard';
import { postNotat } from '../../../../../io/http';
import { NotatDTO } from '../../../../../io/types';
import { notaterStateRefetchKey, useNotaterForVedtaksperiode } from '../../../../../state/notater';
import { usePersondataSkalAnonymiseres } from '../../../../../state/person';
import { useOperationErrorHandler } from '../../../../../state/varsler';
import { ignorePromise } from '../../../../../utils/promise';

import { anonymisertPersoninfo } from '../../../../../agurkdata';
import { getFormattedName } from '../Søker';
import { SisteNotat } from './SisteNotat';

const Knappegruppe = styled.span`
    display: flex;
    margin-top: 2em;

    > button:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

const StyledUndertittel = styled(BodyShort)`
    margin-top: 1.5rem;
`;

const StyledModal = styled(Modal)`
    width: 670px;
    padding: 2rem;

    h1 {
        font-size: 24px;
        font-weight: 600;
    }
`;

const Tittel = styled.h1`
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--navds-color-text-primary);
`;

const StyledTextarea = styled(Textarea)`
    width: 100%;
    min-height: 120px;
    white-space: pre-line;
`;

interface Props {
    onClose: () => void;
    personinfo: Personinfo;
    vedtaksperiodeId: string;
    leggSakPåVent?: () => void;
    navigerTilbake?: () => void;
}

export const NyttNotatModal = ({ onClose, personinfo, vedtaksperiodeId, leggSakPåVent, navigerTilbake }: Props) => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const refreshNotater = useSetRecoilState(notaterStateRefetchKey);
    const errorHandler = useOperationErrorHandler('Nytt Notat');
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const formatertNavn = getFormattedName(anonymiseringEnabled ? anonymisertPersoninfo : personinfo);

    const sakSkalLeggesPåVent = leggSakPåVent !== undefined;
    const [isFetching, setIsFetching] = useState(false);
    const [tekst, setTekst] = useState('');
    const tekstMaxLength = 100;

    const tittel = sakSkalLeggesPåVent ? 'Legg på vent' : 'Lagt på vent - ny kommentar';
    const undertittel = `Søker: ${formatertNavn}`;

    const keyboardEvent = (event: React.KeyboardEvent) => {
        if (event.key == Key.Enter || event.key == ' ') event.stopPropagation();
    };

    const closeModal = (event: React.MouseEvent | React.KeyboardEvent) => {
        event.stopPropagation();
        onClose();
    };

    const prøvPostNotat = (notat: NotatDTO) => {
        setIsFetching(true);
        ignorePromise(
            postNotat(vedtaksperiodeId, notat)
                .then(() => {
                    refreshNotater(new Date());
                    leggSakPåVent !== undefined && leggSakPåVent();
                })
                .finally(() => {
                    setIsFetching(false);
                    if (navigerTilbake) navigerTilbake();
                    else onClose();
                }),
            errorHandler
        );
    };

    const submit = (event: React.MouseEvent) => {
        event.stopPropagation();
        const notat = { tekst };
        prøvPostNotat(notat);
    };

    const textAreaClickHandler = () => {
        return (event: React.MouseEvent) => {
            event.stopPropagation();
        };
    };

    return (
        <StyledModal title={<Tittel>{tittel}</Tittel>} contentLabel="Notat" isOpen onRequestClose={closeModal}>
            <div>
                <StyledUndertittel as="p">{undertittel}</StyledUndertittel>
                {notaterForOppgave.length > 0 && (
                    <>
                        <SisteNotat notater={notaterForOppgave} multiline={false} />
                        <br />
                    </>
                )}
                <StyledTextarea
                    label=""
                    name="tekst"
                    value={tekst}
                    error={tekst.length > tekstMaxLength ? 'Det er kun tillatt med 100 tegn' : null}
                    onChange={(event: ChangeEvent) => {
                        setTekst((event.target as HTMLInputElement).value);
                    }}
                    onClick={textAreaClickHandler()}
                    onKeyPress={keyboardEvent}
                    description={`Skriv hvorfor saken er lagt på vent, så det er lettere å starte igjen senere.\nEks: Kontaktet arbeidsgiver, fikk ikke svar.\nKommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn.`}
                    maxLength={tekstMaxLength}
                />
                <Knappegruppe>
                    <Button
                        size="small"
                        disabled={isFetching || tekst.trim() === '' || tekst.trim().length > tekstMaxLength}
                        onClick={submit}
                    >
                        {sakSkalLeggesPåVent ? 'Legg på vent' : 'Lagre'}
                        {isFetching && <Loader size="xsmall" />}
                    </Button>
                    {sakSkalLeggesPåVent ? (
                        <Button size="small" variant="secondary" onClick={closeModal}>
                            Avbryt
                        </Button>
                    ) : (
                        <Button variant="secondary" size="small" onClick={navigerTilbake}>
                            Tilbake
                        </Button>
                    )}
                </Knappegruppe>
            </div>
        </StyledModal>
    );
};
