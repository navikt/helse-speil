import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { NyheterQueryResult } from '@external/sanity';

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<NyheterQueryResult>(`*[_type == "nyhet"]{
                    _id,
                    _createdAt,
                    iProd,
                    tittel,
                    beskrivelse,
                    dato,
                    lenke {
                        lenkeTekst,
                        lenkeUrl
                    },
                    modal {
                        antallSlides,
                        tvungenModal,
                        modalOverskrift,
                        modalSlide1 {
                            slideOverskrift,
                            altTekst,
                            "bildeUrl": slideBilde.asset->url,
                            slideBeskrivelse
                        },
                        modalSlide2 {
                            slideOverskrift,
                            altTekst,
                            "bildeUrl": slideBilde.asset->url,
                            slideBeskrivelse
                        },
                        modalSlide3 {
                            slideOverskrift,
                            altTekst,
                            "bildeUrl": slideBilde.asset->url,
                            slideBeskrivelse
                        }
                    }
                } | order(_createdAt desc)`);
    return NextResponse.json(response.data);
};
