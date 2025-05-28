import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { BodyShort, Button, Textarea } from '@navikt/ds-react';

import { useOppdaterFlexjarFeedback } from '@external/flexjar/useOppdaterFlexjarFeedback';
import { useOpprettFlexjarFeedback } from '@external/flexjar/useOpprettFlexjarFeedback';
import { Maybe } from '@io/graphql';
import { FeedbackPayload } from '@typer/flexjar';

import styles from './FlexjarFelles.module.scss';

interface FlexjarFellesProps {
    feedbackId: string;
    children: React.ReactNode;
    activeState: Maybe<number | string>;
    setActiveState: (s: Maybe<number | string>) => void;
    thanksFeedback: boolean;
    setThanksFeedback: (b: boolean) => void;
    getPlaceholder: () => string;
    textRequired?: boolean;
    flexjarsporsmal?: string;
    flexjartittel: string;
    feedbackProps: Record<string, string | undefined | boolean | Array<string>>;
}

export function FlexjarFelles({
    feedbackId,
    getPlaceholder,
    activeState,
    setActiveState,
    thanksFeedback,
    setThanksFeedback,
    flexjartittel,
    flexjarsporsmal,
    children,
    textRequired,
    feedbackProps,
}: FlexjarFellesProps) {
    const [textValue, setTextValue] = useState('');
    const [errorMsg, setErrorMsg] = useState<Maybe<string>>(null);
    const textAreaRef = useRef(null);
    const { mutate: giFeedback, data, error: opprettError, reset } = useOpprettFlexjarFeedback();
    const { mutate: oppdaterFeedback, error: oppdaterError } = useOppdaterFlexjarFeedback();

    const fetchFeedback = useCallback(
        async (knappeklikk?: () => void): Promise<boolean> => {
            if (activeState === null) {
                return false;
            }

            const payload: FeedbackPayload = {
                feedback: textValue,
                feedbackId: feedbackId,
                svar: activeState,
                ...feedbackProps,
            };

            if (data?.id) {
                await oppdaterFeedback({
                    variables: {
                        id: data.id,
                        payload,
                    },
                    onCompleted: knappeklikk,
                });
                return true;
            } else {
                await giFeedback({
                    variables: {
                        payload,
                    },
                });
                return false;
            }
        },
        [activeState, data?.id, feedbackId, feedbackProps, giFeedback, oppdaterFeedback, textValue],
    );
    useEffect(() => {
        setErrorMsg(null);
    }, [activeState]);

    useEffect(() => {
        fetchFeedback().catch();
        /* eslint-disable-next-line react-hooks/exhaustive-deps --
         * Kan ikke bruke fetchFeedback som dependency, da blir det dobble kall
         **/
    }, [activeState]);

    const feedbackPropsString = JSON.stringify(feedbackProps);
    useEffect(() => {
        setErrorMsg(null);
        setTextValue('');
        setActiveState(null);
        reset();
    }, [feedbackPropsString, setActiveState, feedbackId, reset]);

    const sendTilbakemelding = 'Send tilbakemelding';

    const handleSend = async (p: () => void) => {
        if (textRequired && textValue === '') {
            setErrorMsg('Tilbakemeldingen kan ikke være tom. Legg til tekst i feltet.');
            return;
        }
        const oppdatert = await fetchFeedback(p);
        if (oppdatert) {
            setErrorMsg(null);

            setActiveState(null);
            setTextValue('');
            setThanksFeedback(true);
        }
    };

    return (
        <section>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <BodyShort weight="semibold" className={styles.tittel}>
                            {flexjartittel}
                        </BodyShort>
                        <BodyShort className={styles.info}>
                            <p>Tilbakemeldingen din er anonym, og du vil derfor heller ikke få noe svar.</p>
                            <p>Support for enkeltsaker må meldes til coach.</p>
                        </BodyShort>
                    </div>
                    <div className={styles.body}>
                        {flexjarsporsmal && (
                            <BodyShort weight="semibold" className={styles.spørsmål}>
                                {flexjarsporsmal}
                            </BodyShort>
                        )}
                        {children}
                        <form className={styles.form}>
                            <Textarea
                                ref={textAreaRef}
                                error={
                                    errorMsg
                                        ? errorMsg
                                        : opprettError || oppdaterError
                                          ? 'En ukjent feil oppstod, prøv igjen senere'
                                          : undefined
                                }
                                label={getPlaceholder()}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                        e.preventDefault();
                                        await handleSend(() => reset());
                                    }
                                }}
                                value={textValue}
                                onChange={(e) => {
                                    setThanksFeedback(false);
                                    setErrorMsg(null);
                                    setTextValue(e.target.value);
                                }}
                                maxLength={600}
                                minRows={3}
                                description="Ikke skriv inn dine eller andres personopplysninger."
                            />
                            <Button
                                className={styles.send}
                                size="medium"
                                variant="secondary-neutral"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await handleSend(() => reset());
                                }}
                                disabled={activeState === null}
                            >
                                {sendTilbakemelding}
                            </Button>
                        </form>
                    </div>
                </div>
                <div aria-live="polite">
                    {thanksFeedback && (
                        <div className={styles.thanks}>
                            <BodyShort size="medium" className={styles.header}>
                                Takk for tilbakemeldingen din!
                            </BodyShort>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

interface FeedbackButtonProps {
    tekst: string;
    svar: string;
    activeState: Maybe<number | string>;
    setThanksFeedback: (b: boolean) => void;
    setActiveState: (s: Maybe<number | string>) => void;
}

export function FeedbackButton(props: FeedbackButtonProps) {
    return (
        <Button
            variant="secondary-neutral"
            size="medium"
            className={classNames(styles.button, props.activeState === props.svar && styles.answer)}
            aria-pressed={props.activeState === props.svar}
            onClick={() => {
                props.setThanksFeedback(false);
                if (props.activeState === props.svar) {
                    props.setActiveState(null);
                } else {
                    props.setActiveState(props.svar);
                }
            }}
        >
            {props.tekst}
        </Button>
    );
}
