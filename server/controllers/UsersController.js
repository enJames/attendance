import connectToPg from '../models/connectToPg';

const validStaffId = /^[Vv][Ll][Aa][/][Gg][Tt][Bb][/][SsEeCcTtOoAaWwBbLl]{2,3}[/][0-9]{4}$/;
const validPhoneNumber = /^[0][0-9]{10}$/;

const UsersController = {
    checkInput: (req, res, next) => {
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
    login: (req, res) => {
        const { staffId, phoneNumber } = req.body;

        // checking staffId if staffId login is used
        if (staffId && !phoneNumber) {
            if (!validStaffId.test(staffId)) {
                return res.status(400).json({
                    message: `${staffId} is not a valid staff ID`
                });
            }

            connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "staff_id" = ${staffId}`)
                .then((staffData) => {
                    if (!staffData.rows[0]) {
                        return res.status(404).json({
                            message: 'We are having a hard time recognising you. Please check that your staff ID is correct?'
                        });
                    }

                    res.cookie('staff', staffData.rows[0], {
                        httpOnly: true,
                        maxAge: (1000 * 60 * 60 * 4)
                    });

                    return res.status(404).json({
                        message: 'success',
                        data: staffData.rows[0]
                    });
                });
        }

        // checking phone number if phone number login is used
        if (!staffId && phoneNumber) {
            if (!validPhoneNumber.test(phoneNumber)) {
                return res.status(400).json({
                    message: `${phoneNumber} is not a valid phone number`
                });
            }

            connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "mobile_number" = ${phoneNumber}`)
                .then((staffData) => {
                    if (!staffData.rows[0]) {
                        return res.status(404).json({
                            message: 'We are having a hard time recognising you. Please check that your phone number is correct?'
                        });
                    }

                    res.cookie('staff', staffData.rows[0], {
                        httpOnly: true,
                        maxAge: (1000 * 60 * 60 * 4)
                    });

                    return res.status(404).json({
                        message: 'success',
                        data: staffData.rows[0]
                    });
                });
        }
    }
};

export default UsersController;
