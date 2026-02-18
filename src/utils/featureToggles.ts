import { erUtvikling } from '@/env';

export const kanLeggeTilTilkommenInntekt = (erSelvstendigNæring: boolean) => erUtvikling || !erSelvstendigNæring;

export const kanSeAndreYtelser = erUtvikling;
