import React, { useContext } from 'react';
import ItemMapper from '../../../datamapping/beregningMapper';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { toKroner } from '../../../utils/locale';
import { beregningstekster } from '../../../tekster';
import { BehandlingerContext } from '../../../context/BehandlingerContext';

const SykepengegrunnlagInfotrygd = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);

    const inntektsmeldingItems = ItemMapper.inntektsmelding(
        valgtBehandling.sykepengeberegning.inntektsmelding
    );
    const aordningenItems = ItemMapper.aordning(valgtBehandling.sykepengeberegning);

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
                        {`${valgtBehandling.sykepengeberegning.avvik.toLocaleString('nb-NO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })} %`}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={beregningstekster('sykepengegrunnlag')}>
                        {`${toKroner(valgtBehandling.sykepengeberegning.sykepengegrunnlag)} kr`}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={beregningstekster('dagsats')}>
                        {`${toKroner(valgtBehandling.sykepengeberegning.dagsats)} kr`}
                    </InfotrygdListItem>
                </InfotrygdList>
            </span>
        </>
    );
};

export default SykepengegrunnlagInfotrygd;
