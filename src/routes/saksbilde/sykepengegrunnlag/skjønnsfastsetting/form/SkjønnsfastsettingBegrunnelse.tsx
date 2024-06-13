import styles from './SkjønnsfastsettingBegrunnelse.module.scss';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { BodyLong, BodyShort, Textarea } from '@navikt/ds-react';

import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { SkjønnsfastsettingMal } from '@external/sanity';
import { toKronerOgØre } from '@utils/locale';

import { Skjønnsfastsettingstype } from '../skjønnsfastsetting';
import { ExpandableSkjønnsfastsettingBegrunnelseContent } from './ExpandableSkjønnsfastsettingBegrunnelse';

interface SkjønnsfastsettingBegrunnelseProps {
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    valgtMal: SkjønnsfastsettingMal | undefined;
}

export const SkjønnsfastsettingBegrunnelse = ({
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    valgtMal,
}: SkjønnsfastsettingBegrunnelseProps) => {
    const { formState, register, watch } = useFormContext();
    const [showModal, setShowModal] = useState(false);
    const begrunnelseType = watch('type');
    const arbeidsgivere = watch('arbeidsgivere', []);
    const annet = arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);
    const skjønnsfastsatt =
        begrunnelseType === Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT
            ? omregnetÅrsinntekt
            : begrunnelseType === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT
              ? sammenligningsgrunnlag
              : annet;

    return (
        <>
            <div className={styles.skjønnsfastsettingBegrunnelse}>
                <div>
                    <BodyShort>
                        <span className={styles.Bold}>Begrunnelse</span> (teksten vises til bruker)
                    </BodyShort>
                    <ExpandableSkjønnsfastsettingBegrunnelseContent>
                        {valgtMal?.begrunnelse && (
                            <BodyLong className={styles.mal}>
                                {valgtMal.begrunnelse
                                    .replace('${omregnetÅrsinntekt}', toKronerOgØre(omregnetÅrsinntekt))
                                    .replace('${omregnetMånedsinntekt}', toKronerOgØre(omregnetÅrsinntekt / 12))
                                    .replace('${sammenligningsgrunnlag}', toKronerOgØre(sammenligningsgrunnlag))}
                            </BodyLong>
                        )}
                    </ExpandableSkjønnsfastsettingBegrunnelseContent>
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
                    resize
                />
                {valgtMal?.konklusjon && (
                    <BodyLong className={styles.mal}>
                        {valgtMal.konklusjon.replace('${skjønnsfastsattÅrsinntekt}', toKronerOgØre(skjønnsfastsatt))}
                    </BodyLong>
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
