const { fetchMonthlyRequests } = require('../fetchData/adminRequest');

exports.getMonthlyRequests = async (req, res) => {
	try {
		const requestData = await fetchMonthlyRequests(req.query.startDate);
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
