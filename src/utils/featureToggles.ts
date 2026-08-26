import { erUtvikling } from '@/env';

export const kanLeggeTilTilkommenInntekt = (erSelvstendigNæring: boolean) => erUtvikling || !erSelvstendigNæring;

export const skalBrukeNyttTilkommenInntektSkjema = () => erUtvikling;

// TODO: Fjern denne bryteren (og GraphQL-varianten av overstyringene) når REST er rullet ut i
// prod, se plan-overstyring-graphql-til-rest.md
export const skalBrukeRestOverstyring = () => erUtvikling;
