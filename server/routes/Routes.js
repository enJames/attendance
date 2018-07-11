import express from 'express';
import UsersController from '../controllers/UsersController';
import Protect from '../middlewares/Protect';

const Routes = express.Router();
const { checkInput, verify } = Protect;
const {
    login,
    dashControl,
    markAttendance
} = UsersController;

Routes.get('/', (req, res) => res.sendFile());
Routes.get('/login', login);
Routes.post('/login', checkInput, login);
Routes.get('/dashboard', dashControl);
Routes.post('/dashboard', verify, markAttendance);

export default Routes;
