import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { BodyLong, BodyShort, Textarea } from '@navikt/ds-react';

import { Button } from '@components/Button';
import { Modal } from '@components/Modal';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { sanityMaler } from '@utils/featureToggles';
import { toKronerOgØre } from '@utils/locale';

import { skjønnsfastsettelseBegrunnelser } from '../skjønnsfastsetting';
import { skjønnsfastsettingMaler } from '../state';

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
    const valgtÅrsak = useWatch({ name: 'årsak' });
    const malFraSanity = useRecoilValue(skjønnsfastsettingMaler).find((it) => it.arsak === valgtÅrsak);
    const [showModal, setShowModal] = useState(false);
    const begrunnelseId = watch('begrunnelseId');
    const arbeidsgivere = watch('arbeidsgivere', []);
    const annet = arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);
    const skjønnsfastsatt =
        begrunnelseId === '0' ? omregnetÅrsinntekt : begrunnelseId === '1' ? sammenligningsgrunnlag : annet;

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
                    {!sanityMaler && valgtBegrunnelse?.mal && (
                        <BodyLong className={styles.mal}>{valgtBegrunnelse.mal}</BodyLong>
                    )}
                    {sanityMaler && malFraSanity?.begrunnelse && (
                        <BodyLong className={styles.mal}>
                            {malFraSanity.begrunnelse
                                .replace('${omregnetÅrsinntekt}', toKronerOgØre(omregnetÅrsinntekt))
                                .replace('${omregnetMånedsinntekt}', toKronerOgØre(omregnetÅrsinntekt / 12))
                                .replace('${sammenligningsgrunnlag}', toKronerOgØre(sammenligningsgrunnlag))}
                        </BodyLong>
                    )}
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
                {!sanityMaler && valgtBegrunnelse?.konklusjon && (
                    <BodyLong className={styles.mal}>{valgtBegrunnelse.konklusjon}</BodyLong>
                )}
                {sanityMaler && malFraSanity?.konklusjon && (
                    <BodyLong className={styles.mal}>
                        {malFraSanity.konklusjon.replace(
                            '${skjønnsfastsattÅrsinntekt}',
                            toKronerOgØre(skjønnsfastsatt),
                        )}
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
