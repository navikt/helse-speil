import { motion } from 'motion/react';
import Image from 'next/image';

interface EasterGurkProps {
    antallKlikk: number;
}

export const EasterGurk = ({ antallKlikk }: EasterGurkProps) => {
    const shake = {
        x: [1, -1, -3, 3, 1, -1, -3, 3, -1, 1, 1],
        y: [-2, 0, 2, -1, 2, 1, 1, -1, 2, -2],
        rotate: [0, -1, 1, 0, 1, -1, 0, -1, 1, 0, -1],
        scale: [1],
        transition: { repeat: Infinity, duration: 1 },
    };

    const supershake = {
        x: [1, -1, -3, 4, 1, -1, -4, 3, -1, 0, 1],
        y: [-2, 0, 2, -1, 2, 1, 1, -1, 2, -2],
        rotate: [0, -2, 2, 0, 2, -2, 0, -2, 2, 0, -2],
        scale: [1, 2, 1],
        transition: { repeat: Infinity, duration: 0.75 },
    };

    return (
        <motion.div
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={antallKlikk < 7 ? {} : antallKlikk < 11 ? shake : supershake}
        >
            {antallKlikk < 5 ? (
                <Image src="/gladgurk.png" alt="Glad agurk" width="24" height="24" />
            ) : antallKlikk < 7 ? (
                <Image src="/grettengurk.png" alt="Gretten agurk" width="24" height="24" />
            ) : antallKlikk < 9 ? (
                <Image src="/sinnagurk.png" alt="Sinna agurk" width="24" height="24" />
            ) : antallKlikk < 11 ? (
                <Image src="/bannegurk.png" alt="Banneagurk" width="24" height="24" />
            ) : (
                <Image src="/eksplogurk.png" alt="Eksplosjon agurk" width="24" height="24" />
            )}
        </motion.div>
    );
};
