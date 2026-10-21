import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';

type AndreYtelserTilgang = {
    kanEndres: boolean;
    kanGjenopprettes: boolean;
};

export const useAndreYtelserTilgang = (person: ApiSaksbildePerson | null, fjernet: boolean): AndreYtelserTilgang => {
    const erReadOnly = useHarTotrinnsvurdering(person);

    return {
        kanEndres: !fjernet && !erReadOnly,
        kanGjenopprettes: fjernet && !erReadOnly,
    };
};
