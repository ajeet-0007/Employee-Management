const { fetchRangeTimesheets } = require('../fetchData/adminTimesheet');

exports.getRangeTimesheets = async (req, res) => {
	try {
		const timesheetData = await fetchRangeTimesheets(req.query.startDate, req.query.endDate);
		if (timesheetData.length === 0) {
			return res.status(404).json({ message: 'No timesheets found' });
		} else {
			return res.status(200).json(timesheetData);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error'
		});
	}
};
