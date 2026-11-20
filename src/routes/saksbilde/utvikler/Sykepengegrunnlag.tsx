import { BodyShort, Loader } from '@navikt/ds-react';

import { useHentSykepengegrunnlag } from '@io/rest/generated/sykepengegrunnlag/sykepengegrunnlag/sykepengegrunnlag';
import { JsonVisning } from '@saksbilde/utvikler/JsonVisning';

interface SykepengegrunnlagProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
}

export function Sykepengegrunnlag({ personPseudoId, skjæringstidspunkt }: SykepengegrunnlagProps) {
    const { data, isPending, error } = useHentSykepengegrunnlag(personPseudoId, {
        skjaeringstidspunkt: skjæringstidspunkt,
    });

    if (isPending) return <Loader size="small" title="Henter sykepengegrunnlag" />;
    if (error) return <BodyShort>Kunne ikke hente sykepengegrunnlag: {error.message}</BodyShort>;
    if (data.sykepengegrunnlag.length === 0)
        return <BodyShort>Fant ikke noe sykepengegrunnlag for skjæringstidspunktet</BodyShort>;
    return <JsonVisning data={data} />;
}
