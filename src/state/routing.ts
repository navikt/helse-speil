import { useParams, useRouter } from 'next/navigation';

import { Maybe } from '@io/graphql';

export const useNavigerTilTilkommenInntekt = () => {
    const aktorId = useAktørIdFraUrl();
    const router = useRouter();

    return (tilkommenInntektId: string) => {
        router.push(`/person/${aktorId}/tilkommeninntekt/${tilkommenInntektId}`);
    };
};

export const useTilkommenInntektIdFraUrl = (): Maybe<string> => {
    const { tilkommenInntektId } = useParams<{ tilkommenInntektId?: string }>();

    return tilkommenInntektId !== undefined ? tilkommenInntektId : null;
};

export const useAktørIdFraUrl = (): Maybe<string> => {
    const { aktorId } = useParams<{ aktorId?: string }>();

    return aktorId !== undefined ? aktorId : null;
};
