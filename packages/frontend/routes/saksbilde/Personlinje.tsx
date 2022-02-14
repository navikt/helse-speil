import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { BodyShort } from '@navikt/ds-react';

import { getFormatertNavn, usePersoninfo } from '@state/person';
import { useIsAnonymous } from '@state/anonymization';
import { NORSK_DATOFORMAT } from '@utils/date';
import { capitalizeName } from '@utils/locale';

import { Clipboard } from '@components/clipboard';
import { Manneikon } from '@components/ikoner/Manneikon';
import { Kvinneikon } from '@components/ikoner/Kvinneikon';
import { KjønnsnøytraltIkon } from '@components/ikoner/KjønnsnøytraltIkon';
import { AnonymizableBold } from '@components/anonymizable/AnonymizableBold';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';

import { utbetalingsoversikt } from '../../featureToggles';

import styles from './Personlinje.module.css';

const formatFnr = (fnr: string) => fnr.slice(0, 6) + ' ' + fnr.slice(6);

interface KjønnsikonProps extends React.SVGAttributes<SVGElement> {
    kjønn: 'kvinne' | 'mann' | 'ukjent';
}

const Kjønnsikon: React.VFC<KjønnsikonProps> = ({ kjønn, ...svgProps }) => {
    switch (kjønn.toLowerCase()) {
        case 'kvinne':
            return <Kvinneikon alt="Kvinne" {...svgProps} />;
        case 'mann':
            return <Manneikon alt="Mann" {...svgProps} />;
        default:
            return <KjønnsnøytraltIkon alt="Ukjent" {...svgProps} />;
    }
};

const LoadingText = () => <div className={styles.LoadingText} />;

const Separator = () => <BodyShort className={styles.Separator}>/</BodyShort>;

export const LasterPersonlinje = () => (
    <div className={styles.Personlinje}>
        <KjønnsnøytraltIkon />
        <LoadingText />
        <Separator />
        <LoadingText />
        <Separator />
        <LoadingText />
        <Separator />
        <LoadingText />
        <Separator />
        <LoadingText />
    </div>
);

interface PersonlinjeProps {
    aktørId: string;
    enhet: Boenhet;
    dødsdato?: Dayjs;
}

export const Personlinje = ({ aktørId, enhet, dødsdato }: PersonlinjeProps) => {
    const isAnonymous = useIsAnonymous();
    const personinfo = usePersoninfo();
    const personnavn = getFormatertNavn(personinfo, ['E', ',', 'F', 'M']);

    return (
        <div className={styles.Personlinje}>
            <Kjønnsikon kjønn={isAnonymous ? 'ukjent' : personinfo.kjønn} />
            <AnonymizableBold>
                {capitalizeName(personnavn)}
                {personinfo.fødselsdato !== null && ` (${dayjs().diff(personinfo.fødselsdato, 'year')} år)`}
            </AnonymizableBold>
            <BodyShort className={styles.Separator}>/</BodyShort>
            {personinfo.fnr ? (
                <Clipboard
                    preserveWhitespace={false}
                    copyMessage="Fødselsnummer er kopiert"
                    dataTip="Kopier fødselsnummer (Alt + C)"
                >
                    <AnonymizableText>{formatFnr(personinfo.fnr)}</AnonymizableText>
                </Clipboard>
            ) : (
                <BodyShort>Fødselsnummer ikke tilgjengelig</BodyShort>
            )}
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>Aktør-ID:&nbsp;</AnonymizableText>
            <Clipboard preserveWhitespace={false} copyMessage="Aktør-ID er kopiert" dataTip="Kopier aktør-ID">
                <AnonymizableText>{aktørId}</AnonymizableText>
            </Clipboard>
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>
                Boenhet: {enhet.id} ({enhet.navn})
            </AnonymizableText>
            {utbetalingsoversikt && (
                <>
                    <BodyShort className={styles.Separator}>/</BodyShort>
                    <Link className={styles.Link} to={`${aktørId}/../utbetalingshistorikk`}>
                        Utbetalingsoversikt
                    </Link>
                </>
            )}
            {personinfo.adressebeskyttelse === 'Fortrolig' && (
                <AnonymizableContainer className={classNames(styles.Etikett, styles.adressebeskyttelse)}>
                    {personinfo.adressebeskyttelse} adresse
                </AnonymizableContainer>
            )}
            {dødsdato && (
                <AnonymizableContainer className={classNames(styles.Etikett, styles.dødsdato)}>
                    Død {dødsdato?.format(NORSK_DATOFORMAT)}
                </AnonymizableContainer>
            )}
        </div>
    );
};
