const moment = require('moment');

const { usersRepository } = require('../../repositories');
const { ApplicationError } = require('../../utils');
const { encryptor, mailer } = require('../../helpers');
const userService = require('../users/update.service');

const { resetTokenExpiresIn, clientURL } = require('../../config/env');

module.exports.forgotPassword = async (email) => {
  const user = await usersRepository.get({ email });
  if (!user) {
    throw new ApplicationError('User not found', 404);
  }

  const payload = {
    sub: user.id,
    iat: moment().unix(),
  };

  const token = await encryptor.generateToken(payload, {
    algorithm: 'HS256',
    expiresIn: resetTokenExpiresIn,
  });

  await userService.update(user.id, { passwordResetToken: token });

  const mailContent = {
    text: `To reset your password, access the following link: ${clientURL}/${token}/reset-password`,
    html: `<span>To reset your password, access the following link: ${clientURL}/${token}/reset-password</span>`,
  };

  await mailer.dispatchMail(user.email, 'Password Reset Link', mailContent);
};
