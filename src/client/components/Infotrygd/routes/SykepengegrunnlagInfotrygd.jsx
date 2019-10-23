import React, { useContext } from 'react';
import ItemMapper from '../../../datamapping/beregningMapper';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { toKroner } from '../../../utils/locale';
import { beregningstekster } from '../../../tekster';
import { BehandlingerContext } from '../../../context/BehandlingerContext';

const SykepengegrunnlagInfotrygd = () => {
    const { personTilBehandling } = useContext(BehandlingerContext);

    const inntektsmeldingItems = ItemMapper.inntektsmelding(
        personTilBehandling.sykepengeberegning.inntektsmelding
    );
    const aordningenItems = ItemMapper.aordning(personTilBehandling.sykepengeberegning);

    return (
        <>
            <h2>Sykepengegrunnlag</h2>
            <span className="Infotrygd__content">
                <InfotrygdList>
                    <InfotrygdListItem label={beregningstekster('inntektsmeldinger')} status="OK" />
                    {inntektsmeldingItems.map(item => (
                        <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
                    ))}
                    <InfotrygdListItem />
                    <InfotrygdListItem label={beregningstekster('aordningen')} status="OK" />
                    {aordningenItems.map(item => (
                        <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
                    ))}
                    <InfotrygdListItem />
                    <InfotrygdListItem label={beregningstekster('avvik')}>
                        {`${personTilBehandling.sykepengeberegning.avvik.toLocaleString('nb-NO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })} %`}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={beregningstekster('sykepengegrunnlag')}>
                        {`${toKroner(personTilBehandling.sykepengeberegning.sykepengegrunnlag)} kr`}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={beregningstekster('dagsats')}>
                        {`${toKroner(personTilBehandling.sykepengeberegning.dagsats)} kr`}
                    </InfotrygdListItem>
                </InfotrygdList>
            </span>
        </>
    );
};

export default SykepengegrunnlagInfotrygd;
