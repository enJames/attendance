import random from './random';

const Protect = {
    checkInput: (req, res, next) => {
        const { staffId, phoneNumber } = req.body;

        // Check that no malicious act or error sends both information
        if (staffId && phoneNumber) {
            return res.status(400).json({
                status: 'fail',
                message: 'We are confused'
            });
        }

        // if staffId exists, check that it is not empty
        if (staffId && !phoneNumber) {
            if (staffId.trim().length === 0) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Staff ID field is empty'
                });
            }
            return next();
        }

        // if phoneNumber exists, check that it is not empty
        if (!staffId && phoneNumber) {
            if (phoneNumber.trim().length === 0) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Phone Number field is empty'
                });
            }

            return next();
        }

        return res.status(400).json({
            status: 'fail',
            message: 'Request not understood'
        });
    },
    verify: (req, res, next) => {
        const { attendanceCode } = req.body;

        // if user is not logged, send to login page
        if (!req.cookies.staffId) {
            return res.redirect('/login');
        }

        // checking for empty fields
        if (!attendanceCode || attendanceCode.trim() === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Attendance code field is empty'
            });
        }

        if (!(random.indexOf(attendanceCode) >= 0)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Attendance code does not exist'
            });
        }

        return next();
    }
};

export default Protect;
