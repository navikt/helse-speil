import { erUtvikling } from '@/env';

const groupIdForBesluttere = '59f26eef-0a4f-4038-bf46-3a5b2f252155';

export const kanLeggeTilTilkommenInntekt = (erSelvstendigNæring: boolean) => erUtvikling || !erSelvstendigNæring;

export const harBeslutterrolle = (grupper: string[]): boolean => grupper.includes(groupIdForBesluttere);

export const kanSeAndreYtelser = erUtvikling;
