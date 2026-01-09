import React, { ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { BodyShort, HelpText, Textarea, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { SkjønnsfastsettingMal } from '@external/sanity';
import { toKronerOgØre } from '@utils/locale';

import { Skjønnsfastsettingstype } from '../skjønnsfastsetting';
import { ExpandableSkjønnsfastsettingBegrunnelseContent } from './ExpandableSkjønnsfastsettingBegrunnelse';

import styles from './SkjønnsfastsettingBegrunnelse.module.scss';

type SkjønnsfastsettingBegrunnelseProps = {
    omregnetÅrsinntekt: number;
    sammenligningsgrunnlag: number;
    valgtMal: SkjønnsfastsettingMal | undefined;
};

export const SkjønnsfastsettingBegrunnelse = ({
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    valgtMal,
}: SkjønnsfastsettingBegrunnelseProps): ReactElement => {
    const { formState, register } = useFormContext();
    const begrunnelseType = useWatch({ name: 'type' });
    const arbeidsgivere = useWatch({ name: 'arbeidsgivere' }) ?? [];
    const annet = arbeidsgivere.reduce((n: number, { årlig }: { årlig: number }) => n + årlig, 0);
    const skjønnsfastsatt =
        begrunnelseType === Skjønnsfastsettingstype.OMREGNET_ÅRSINNTEKT
            ? omregnetÅrsinntekt
            : begrunnelseType === Skjønnsfastsettingstype.RAPPORTERT_ÅRSINNTEKT
              ? sammenligningsgrunnlag
              : annet;

    return (
        <div className={styles.skjønnsfastsettingBegrunnelse}>
            <div>
                <BodyShort>
                    <span className={styles.Bold}>Begrunnelse</span> Teksten vises til den sykmeldte i «Svar på søknad
                    om sykepenger».
                </BodyShort>
                <ExpandableSkjønnsfastsettingBegrunnelseContent>
                    {valgtMal?.begrunnelse && (
                        <BodyShortWithPreWrap className={styles.mal}>
                            {valgtMal.begrunnelse
                                .replace('${omregnetÅrsinntekt}', toKronerOgØre(omregnetÅrsinntekt))
                                .replace('${omregnetMånedsinntekt}', toKronerOgØre(omregnetÅrsinntekt / 12))
                                .replace('${sammenligningsgrunnlag}', toKronerOgØre(sammenligningsgrunnlag))}
                        </BodyShortWithPreWrap>
                    )}
                </ExpandableSkjønnsfastsettingBegrunnelseContent>
            </div>
            <Textarea
                className={styles.fritekst}
                label={
                    <span className={styles.fritekstlabel}>
                        Nærmere begrunnelse for skjønnsvurderingen&nbsp;
                        <HelpText title="Veiledning">
                            <VStack gap="space-16">
                                <BodyShort>
                                    Beskriv arbeidssituasjonen til bruker nå og de siste 12 månedene, eventuelt
                                    tidligere år.
                                </BodyShort>
                                <VStack>
                                    <BodyShort>Eksempler på endringer kan være:</BodyShort>
                                    <ul>
                                        <li>Du har skiftet jobb</li>
                                        <li>Du har endret stillingsgrad i samme jobb</li>
                                        <li>Du har hatt overgang fra midlertidig til fast stilling</li>
                                        <li>Du har nylig begynt i arbeidslivet</li>
                                    </ul>
                                </VStack>
                            </VStack>
                        </HelpText>
                    </span>
                }
                {...register('begrunnelseFritekst', {
                    required: 'Du må skrive en nærmere begrunnelse',
                })}
                description="Teksten vises til den sykmeldte i «Svar på søknad om sykepenger»."
                error={
                    formState.errors.begrunnelseFritekst
                        ? (formState.errors.begrunnelseFritekst.message as string)
                        : null
                }
                resize
            />
            {valgtMal?.konklusjon && (
                <BodyShortWithPreWrap className={styles.mal}>
                    {valgtMal.konklusjon.replace('${skjønnsfastsattÅrsinntekt}', toKronerOgØre(skjønnsfastsatt))}
                </BodyShortWithPreWrap>
            )}
        </div>
    );
};
