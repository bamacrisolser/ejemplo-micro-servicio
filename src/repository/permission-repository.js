import Permission from '../models/permission.model.mjs';

const findAll = async () => {
  const { count, rows } = await Permission.findAndCountAll();
  const response = {
    count,
    permissions: rows,
  };
  return response;
};

export const methods = {
  findAll,
};
