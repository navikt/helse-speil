import React from 'react';
import Modal from 'nav-frontend-modal';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import './TidligerePerioderModal.less';
import { first26WeeksInterval, NORSK_DATOFORMAT, workdaysBetween } from '../../../utils/date';
import { Periode } from '../../../context/types';
import { Dayjs } from 'dayjs';

document && document.getElementById('#root') && Modal.setAppElement('#root');

interface Props {
    perioder: Periode[];
    onClose: () => void;
    førsteFraværsdag: Dayjs;
}

const TidligerePerioderModal = ({ perioder, onClose, førsteFraværsdag }: Props) => {
    const første26UkersMellomromIndex = first26WeeksInterval(perioder, førsteFraværsdag);

    return (
        <Modal
            className="TidligerePerioderModal"
            isOpen={true}
            contentLabel="Tidligere sykepengeperioder"
            onRequestClose={onClose}
        >
            <Undertittel>Tidligere perioder de siste 3 årene</Undertittel>
            {perioder.length === 0 ? (
                <Normaltekst>Ingen tidligere perioder.</Normaltekst>
            ) : (
                <>
                    {første26UkersMellomromIndex === 0 && (
                        <Normaltekst>Det er 26 uker eller mer siden forrige periode.</Normaltekst>
                    )}
                    <div className="periodeliste">
                        <div className="periode">
                            <Element>Første dag</Element>
                            <Element>Siste dag</Element>
                            <Element>Antall ukedager</Element>
                        </div>
                        {perioder.map((item, i) => (
                            <React.Fragment key={`${item.fom}-${item.tom}-${i}`}>
                                {første26UkersMellomromIndex > 0 && i === første26UkersMellomromIndex && (
                                    <Element className="periode">Første 26-ukers mellomrom</Element>
                                )}
                                <div className="periode" key={JSON.stringify(item)}>
                                    <Normaltekst>{item.fom.format(NORSK_DATOFORMAT)}</Normaltekst>
                                    <Normaltekst>{item.tom.format(NORSK_DATOFORMAT)}</Normaltekst>
                                    <Normaltekst>{workdaysBetween(item.fom, item.tom)}</Normaltekst>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </>
            )}
        </Modal>
    );
};

export default TidligerePerioderModal;
