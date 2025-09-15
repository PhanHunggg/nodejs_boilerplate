const { SEND_EMAIL_TYPE } = require("../constant/send-mail.constant");
const { BadRequestError } = require("../core/error.response");
const { HistorySendMailModel, HistorySendSMSModel } = require("../models");

const generateOTP = (length = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // Chọn số từ 0-9
  }
  return otp.padStart(length, "0"); // Đảm bảo độ dài OTP là 6 ký tự
};

const checkOTP = async (identifier, types, time, otp) => {
  try {
    const typeArray = Array.isArray(types) ? types : [types];

    const invalidTypes = typeArray.filter(type => !SEND_EMAIL_TYPE[type]);
    if (invalidTypes.length > 0) {
      return { status: false, message: `Verification type is not supported` };
    }

    const isEmail = identifier.includes('@');

    const historyModel = isEmail ? HistorySendMailModel : HistorySendSMSModel;
    const identifierField = isEmail ? 'email' : 'phone';

    const typeValues = typeArray.map(type => SEND_EMAIL_TYPE[type]);

    const query = {
      [identifierField]: identifier,
      type: { $in: typeValues },
      timestamps: { $gte: time },
      status: false
    };

    const data = await historyModel
      .findOne(query)
      .sort({ createdAt: -1 })
      .limit(1);

    if (!data) {
      throw new BadRequestError('OTP not found');
    }

    const isMatch = data.otp === otp;
    if (!isMatch) {
      throw new BadRequestError('OTP not match');
    }

    await historyModel.findByIdAndUpdate(data._id, {
      status: true
    });

    return { status: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { status: false, message: 'Error verifying OTP' };
  }
};

module.exports = {
  generateOTP,
  checkOTP,
};