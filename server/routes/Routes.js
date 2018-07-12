import express from 'express';
import UsersController from '../controllers/UsersController';
import Protect from '../middlewares/Protect';

const Routes = express.Router();
const { checkInput, verify } = Protect;
const {
    login,
    dashControl,
    markAttendance,
    logout
} = UsersController;

// Home page
Routes.get('/', (req, res) => {
    if (req.cookies.staffId) {
        return res.render('index-signed');
    }
    return res.render('index');
});

// Login page
Routes.get('/login', (req, res) => {
    if (req.cookies.staff) {
        return res.redirect('/dashboard');
    }
    return res.render('login');
});

// User dashboard
Routes.get('/dashboard', dashControl);

// POST REQUESTS
// login request
Routes.post('/login', checkInput, login);

// Mark attendance
Routes.put('/dashboard', verify, markAttendance);

// Logout
Routes.post('/logout', logout);

export default Routes;
