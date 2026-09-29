import { defineQuery } from 'groq';
import { NextResponse } from 'next/server';

import { stubEllerVideresendTilSanity } from '@app/api/sanity/stubEllerVideresendTilSanity';
import { NyheterQueryResult } from '@io/sanity/generated/sanity.types';

const nyheterQuery = defineQuery(`*[_type == "nyhet"]{
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

export const GET = async () => {
    const response = await stubEllerVideresendTilSanity<NyheterQueryResult>(nyheterQuery);
    return NextResponse.json(response.data);
};
