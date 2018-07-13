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
                    status: 'fail',
                    message: `'${staffId}' is not a valid staff ID`
                });
            }

            connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "staffId" = '${staffId}'`)
                .then((staffData) => {
                    if (!staffData.rows[0]) {
                        return res.status(404).json({
                            status: 'fail',
                            message: 'We are having a hard time recognising you. Please check that your staff ID is correct?'
                        });
                    }

                    res.cookie('staffId', staffData.rows[0].staffId, {
                        httpOnly: true,
                        maxAge: (1000 * 60 * 60 * 4)
                    });

                    return res.status(200).json({
                        status: 'success',
                        message: 'Login successful!'
                    });
                });
        }

        // checking phone number if phone number login is used
        if (!staffId && phoneNumber) {
            if (!validPhoneNumber.test(phoneNumber)) {
                return res.status(400).json({
                    status: 'fail',
                    message: `${phoneNumber} is not a valid phone number`
                });
            }

            connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "mobileNumber" LIKE '%${phoneNumber}%'`)
                .then((staffData) => {
                    if (!staffData.rows[0]) {
                        return res.status(404).json({
                            status: 'fail',
                            message: 'We are having a hard time recognising you. Please check that your phone number is correct?'
                        });
                    }

                    // Create cookie
                    res.cookie('staffId', staffData.rows[0].staffId, {
                        httpOnly: true,
                        maxAge: (1000 * 60 * 60 * 4)
                    });

                    return res.status(200).json({
                        status: 'success',
                        message: 'Login successful!'
                    });
                });
        }
    },
    dashControl: (req, res) => {
        if (!req.cookies.staffId) {
            return res.redirect('/login');
        }

        const { staffId } = req.cookies;

        connectToPg.query(`SELECT * FROM "LagosStaff" WHERE "staffId" = '${staffId}'`)
            .then(staffData => res.render('dashboard', staffData.rows[0]));
    },
    markAttendance: (req, res) => {
        const { attendanceCode } = req.body;
        const { staffId } = req.cookies;

        return connectToPg.query(
            `SELECT * from "LagosStaff" WHERE "code" = '${attendanceCode}'`
        )
            .then((codeData) => {
                if (codeData.rows.length > 0) {
                    return res.status(409).json({
                        status: 'fail',
                        message: 'This code has already been used.'
                    });
                }

                connectToPg.query(`SELECT "code" FROM "LagosStaff" WHERE "staffId" = '${staffId}'`)
                    .then((staffData) => {
                        if (staffData.rows[0].code !== null) {
                            return res.status(405).json({
                                status: 'fail',
                                message: 'You have already registered your attendance'
                            });
                        }

                        // Check if it is an excuse code or presence code
                        if (attendanceCode.length > 5) {
                            return connectToPg.query(
                                `UPDATE "LagosStaff" SET "code" = '${attendanceCode}', "status" = 'Excused'
                                WHERE "staffId" = '${staffId}' RETURNING *`
                            )
                                .then((regData) => {
                                    if (regData.rows[0].status === 'Excused') {
                                        return res.status(200).json({
                                            status: 'success',
                                            message: 'Your excuse has been recorded'
                                        });
                                    }
                                    return res.status(500).json({
                                        status: 'error',
                                        message: 'Your excuse request could not be processed'
                                    });
                                })
                                .catch(() => res.status(500).json({
                                    status: 'error',
                                    message: 'Error processing Excuse request'
                                }));
                        }
                        return connectToPg.query(
                            `UPDATE "LagosStaff" SET "code" = '${attendanceCode}', "status" = 'Present'
                            WHERE "staffId" = '${staffId}' RETURNING *`
                        )
                            .then((regData) => {
                                if (regData.rows[0].status === 'Present') {
                                    return res.status(200).json({
                                        status: 'success',
                                        message: 'Your attendance has been recorded'
                                    });
                                }
                                return res.status(500).json({
                                    status: 'error',
                                    message: 'Your request could not be processed'
                                });
                            })
                            .catch(() => res.status(500).json({
                                status: 'error',
                                message: 'Error processing attendance registration'
                            }));
                    })
                    .catch(() => res.status(500).json({
                        status: 'error',
                        message: 'Database communication error'
                    }));
            });
    },
    logout: (req, res) => {
        // Create cookie
        res.clearCookie('staffId');
        return res.status(200).json({
            status: 'success',
            message: 'Logout successful'
        });
    }
};

export default UsersController;
