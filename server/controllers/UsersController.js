import connectToPg from '../models/connectToPg';

const validStaffId = /^[Vv][Ll][Aa][/][Gg][Tt][Bb][/][SsEeCcTtOoAaWwBbLl]{2,3}[/][0-9]{4}$/;
const validPhoneNumber = /^[0][0-9]{10}$/;

const UsersController = {
    login: (req, res) => {
        const { staffId, phoneNumber } = req.body;

        // checking staffId if staffId login is used
        if (staffId && !phoneNumber) {
            if (!validStaffId.test(staffId)) {
                return res.status(400).json({
                    message: `'${staffId}' is not a valid staff ID`
                });
            }

            connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "staffId" = '${staffId}'`)
                .then((staffData) => {
                    if (!staffData.rows[0]) {
                        return res.status(404).json({
                            message: 'We are having a hard time recognising you. Please check that your staff ID is correct?'
                        });
                    }

                    res.cookie('staff', staffData.rows[0].staffId, {
                        httpOnly: true,
                        maxAge: (1000 * 60 * 60 * 4)
                    });

                    return res.status(200).json({
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

            connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "mobileNumber" = ${phoneNumber}`)
                .then((staffData) => {
                    if (!staffData.rows[0]) {
                        return res.status(404).json({
                            message: 'We are having a hard time recognising you. Please check that your phone number is correct?'
                        });
                    }

                    res.cookie('staff', staffData.rows[0].staffId, {
                        httpOnly: true,
                        maxAge: (1000 * 60 * 60 * 4)
                    });

                    return res.status(200).json({
                        message: 'success',
                        data: staffData.rows[0]
                    });
                });
        }
    },
    dashControl: (req, res) => {
        const { staffId } = req.authData;

        connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "staffId" = '${staffId}'`)
            .then(staffData => res.render('dashboard', staffData.rows[0]));
    },
    markAttendance: (req, res) => {
        const { attendanceCode } = req.body;
        const { staffId } = req.authData;

        connectToPg.query(
            `SELECT "code" from "LagosStaff" WHERE "code" = '${attendanceCode}'`
        )
            .then((codeData) => {
                if (!codeData.rows[0]) {
                    connectToPg.query(
                        `UPDATE "LagosStaff" SET "code" = '${attendanceCode}', "status" = 'present'
                        WHERE staffId = ${staffId}`
                    )
                        .then(() => res.status(200).json({
                            status: 'success',
                            message: 'Attendance code field is empty'
                        }));
                }

                return res.status(409).json({
                    status: 'fail',
                    message: 'This code has already been used.'
                });
            });
    }
};

export default UsersController;
