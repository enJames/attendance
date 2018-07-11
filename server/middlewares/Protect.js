import random from './random';

const Protect = {
    checkInput: (req, res, next) => {
        // redirect user if cookie isn't expired
        if (req.headers.cookie) {
            return res.redirect('/dashboard');
        }

        const { staffId, phoneNumber } = req.body;

        // Check that no malicious act or error sends both information
        if (staffId && phoneNumber) {
            return res.status(400).json({
                message: 'We are confused'
            });
        }

        // if staffId exists, check that it is not empty
        if (staffId && !phoneNumber) {
            if (staffId.trim().length === 0) {
                return res.status(400).json({
                    message: 'Staff ID field is empty'
                });
            }
            return next();
        }

        // if phoneNumber exists, check that it is not empty
        if (!staffId && phoneNumber) {
            if (phoneNumber.trim().length === 0) {
                return res.status(400).json({
                    message: 'Phone Number field is empty'
                });
            }

            return next();
        }

        return res.status(400).json({
            message: 'Request not understood'
        });
    },
    verify: (req, res, next) => {
        console.log(req.cookies);
        const { attendanceCode } = req.body;

        // if user is not logged, send to login page
        if (!req.cookies.staff) {
            return res.redirect('/login');
        }

        // checking for empty fields
        if (!attendanceCode || attendanceCode.trim() === 0) {
            return res.status(400).json({
                message: 'Attendance code field is empty'
            });
        }

        console.log(random.indexOf(attendanceCode));

        return next();
    }
};

export default Protect;
