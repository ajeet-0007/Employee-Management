const { fetchRangeRequests } = require('../fetchData/adminRequest');

exports.getRangeRequests = async (req, res) => {
	try {
		const requestData = await fetchRangeRequests(req.query.startDate, req.query.endDate);
		if (requestData.length === 0) {
			return res.status(404).json({ message: 'No requests found' });
		} else {
			return res.status(200).json(requestData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
