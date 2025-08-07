import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { methods as AdminRepository } from '../repository/admin-repository.js';
import { methods as Validator } from '../validators/auth-validator.js';
import error from '../helpers/error-constructor.js';
dotenv.config();

const createToken = async credentials => {
  Validator.loginParameters(credentials);

  const admin = await AdminRepository.getByCredentials(credentials);
  if (admin == null) throw error('Usuario no encontrado');

  let permissions = await AdminRepository.getPermisions(admin.admin_id);
  let rolePermissions = await AdminRepository.getRolePermisions(admin.admin_id);
  let permissionsList = permissions.map(row => row.name);
  let rolePermissionsList = rolePermissions.map(row => row.name);
  let allPermissions = [...new Set([...permissionsList, ...rolePermissionsList])];

  let token = jwt.sign(
    {
      admin: admin,
      permissions: allPermissions,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes
    },
    process.env.SECRETJWT
  );

  let refreshToken = jwt.sign(
    {
      admin: admin,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3, // 3 days
    },
    process.env.SECRETJWT
  );

  return {
    token: token,
    refresh_token: refreshToken,
  };
};

const refreshToken = async token => {
  try {
    if (!token) throw error("'x-refresh-token' header is mandatory", null, 401);
    const decoded = jwt.verify(token, process.env.SECRETJWT);
    const adminId = decoded.admin.admin_id;

    const admin = await AdminRepository.findOne(adminId);
    if (!admin) throw error('User not found', null, 401);

    let permissions = await AdminRepository.getPermisions(adminId);
    let rolePermissions = await AdminRepository.getRolePermisions(adminId);
    let permissionsList = permissions.map(row => row.name);
    let rolePermissionsList = rolePermissions.map(row => row.name);
    let allPermissions = [...new Set([...permissionsList, ...rolePermissionsList])];

    let newToken = jwt.sign(
      {
        admin: admin,
        permissions: allPermissions,
        exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes
      },
      process.env.SECRETJWT
    );

    return { token: newToken };
  } catch (err) {
    throw error(err.message, null, 401);
  }
};

export const methods = {
  createToken,
  refreshToken,
};
