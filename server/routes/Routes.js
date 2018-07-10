import express from 'express';
import UsersController from '../controllers/UsersController';

const Routes = express.Router();

const { checkInput, login } = UsersController;

Routes.post('/login', checkInput, login);
