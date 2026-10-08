import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { PersonFragment } from '@io/graphql';

type AndreYtelserTilgang = {
    kanEndres: boolean;
    kanGjenopprettes: boolean;
};

export const useAndreYtelserTilgang = (person: PersonFragment | null, fjernet: boolean): AndreYtelserTilgang => {
    const erReadOnly = useHarTotrinnsvurdering(person);

    return {
        kanEndres: !fjernet && !erReadOnly,
        kanGjenopprettes: fjernet && !erReadOnly,
    };
};
