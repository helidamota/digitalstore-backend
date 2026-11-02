const { User } = require('../models');

class UserService {
  static async findAll() {
    const users = await User.findAll({
      attributes: ['id', 'firstname', 'surname', 'email'],
    });
    return users;
  }

  static async findById(id) {
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstname', 'surname', 'email'],
    });
    return user;
  }

  static async create(data) {
    const user = await User.create(data);
    return user;
  }

  static async update(id, data) {
    const [affectedCount] = await User.update(data, {
      where: { id },
    });
    return affectedCount;
  }

  static async delete(id) {
    const affectedCount = await User.destroy({
      where: { id },
    });
    return affectedCount;
  }
}

module.exports = UserService;
