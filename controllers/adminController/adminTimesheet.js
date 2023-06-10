const { fetchMonthlyTimesheets } = require('../fetchData/adminTimesheet');

exports.getMonthlyTimesheets = async (req, res) => {
	try {
		const timesheetData = await fetchMonthlyTimesheets(req.query.startDate);
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
