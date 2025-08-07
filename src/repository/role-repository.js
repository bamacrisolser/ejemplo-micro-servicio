import Role from '../models/role.model.mjs';

const findAll = async () => {
  const { count, rows } = await Role.findAndCountAll();
  const response = {
    count,
    roles: rows,
  };
  return response;
};

export const methods = {
  findAll,
};
