import { methods as UserService } from '../service/auth-service.js';
import { methods as Response } from '../helpers/response-handler.js';

const getUserToken = async (req, res, next) => {
  try {
    const token = await UserService.createToken(req.body);
    const message = 'Token generado';
    const additionalData = token;

    Response.successHandler(req, res, { message, additionalData });
    return;
  } catch (error) {
    next(error);
  }
};

const refreshUserToken = async (req, res, next) => {
  try {
    const token = req.headers['x-refresh-token'];
    const newToken = await UserService.refreshToken(token);
    const message = 'Token actualizado';
    const additionalData = newToken;

    Response.successHandler(req, res, { message, additionalData });
    return;
  } catch (error) {
    next(error);
  }
};

export const methods = {
  getUserToken,
  refreshUserToken,
};
