import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { BodyLong, BodyShort, Textarea } from '@navikt/ds-react';

import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';

import { skjønnsfastsettelseBegrunnelser } from '../skjønnsfastsetting';

import styles from './SkjønnsfastsettingBegrunnelse.module.css';

interface SkjønnsfastsettingBegrunnelseProps {
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
}

export const SkjønnsfastsettingBegrunnelse = ({
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
}: SkjønnsfastsettingBegrunnelseProps) => {
    const { formState, register, watch } = useFormContext();
    const [showModal, setShowModal] = useState(false);
    const begrunnelseId = watch('begrunnelseId');
    const arbeidsgivere = watch('arbeidsgivere', []);
    const annet = arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);

    const valgtBegrunnelse = skjønnsfastsettelseBegrunnelser(
        omregnetÅrsinntekt,
        sammenligningsgrunnlag,
        annet,
        arbeidsgivere.length,
    ).find((begrunnelse) => begrunnelse.id === begrunnelseId);

    return (
        <>
            <div className={styles.skjønnsfastsettingBegrunnelse}>
                <div>
                    <BodyShort>
                        <span className={styles.Bold}>Begrunnelse</span> (teksten vises til bruker)
                    </BodyShort>
                    {valgtBegrunnelse?.mal && <BodyLong className={styles.mal}>{valgtBegrunnelse.mal}</BodyLong>}
                </div>
                <Textarea
                    className={styles.fritekst}
                    label={
                        <span className={styles.fritekstlabel}>
                            Nærmere begrunnelse for skjønnsvurderingen{' '}
                            <Button className={styles.button} type="button" onClick={() => setShowModal(true)}>
                                <SortInfoikon />
                            </Button>
                        </span>
                    }
                    {...register('begrunnelseFritekst', {
                        required: 'Du må skrive en nærmere begrunnelse',
                    })}
                    description="(Teksten vises til bruker)"
                    error={
                        formState.errors.begrunnelseFritekst
                            ? (formState.errors.begrunnelseFritekst.message as string)
                            : null
                    }
                />
                {valgtBegrunnelse?.konklusjon && (
                    <BodyLong className={styles.mal}>{valgtBegrunnelse.konklusjon}</BodyLong>
                )}
            </div>
            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                title="Beskriv arbeidssituasjonen til bruker nå og de siste 12 månedene, eventuelt tidligere år."
            >
                <div className={styles.fritekstinfo}>
                    <BodyShort>Eksempler på endringer kan være:</BodyShort>
                    <ul>
                        <li>Du har skiftet jobb</li>
                        <li>Du har endret stillingsgrad i samme jobb</li>
                        <li>Du har hatt overgang fra midlertidig til fast stilling</li>
                        <li>Du har nylig begynt i arbeidslivet</li>
                    </ul>
                </div>
            </Modal>
        </>
    );
};
