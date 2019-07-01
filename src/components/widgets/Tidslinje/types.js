import PropTypes from 'prop-types';

export const periodType = {
    periods: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            period: PropTypes.arrayOf(
                PropTypes.shape({
                    startDate: PropTypes.string.isRequired,
                    endDate: PropTypes.string.isRequired
                })
            )
        })
    )
};
