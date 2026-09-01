import { hentVilkårsvurderinger } from './vilkarsvurderingerMock';

export const stub = async () => Response.json(hentVilkårsvurderinger());
