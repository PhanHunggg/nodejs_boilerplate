"use strict";

const { HistorySendMailModel, HistorySendSMSModel } = require("../models");
const { BadRequestError } = require("../core/error.response");
const { SEND_EMAIL_TYPE } = require("../constant/send-mail.constant");

/**
 * Check if an OTP was recently sent to the provided contact (email or phone)
 * 
 * @param {Object} options - Options object
 * @param {string} [options.email] - Email to check
 * @param {string} [options.phone] - Phone to check
 * @param {number} [options.cooldownSeconds=60] - Cooldown period in seconds (default: 60 seconds)
 * @param {Array} [options.types=[SEND_EMAIL_TYPE.REGISTER, SEND_EMAIL_TYPE.GET_OTP]] - Types of operations to check
 * @param {boolean} [options.throwError=true] - Whether to throw an error if rate limited (true) or return an object (false)
 * @returns {Promise<Object>} - Result object {rateLimited: boolean, remainingSeconds: number, message: string}
 */
const checkOTPRateLimit = async ({ 
  email, 
  phone, 
  cooldownSeconds = 60, 
  types = [SEND_EMAIL_TYPE.REGISTER, SEND_EMAIL_TYPE.GET_OTP],
  throwError = true 
}) => {
  if (!email && !phone) {
    if (throwError) {
      throw new BadRequestError('Email or phone is required for rate limit check');
    }
    return { 
      rateLimited: true, 
      remainingSeconds: 0, 
      message: 'Email or phone is required for rate limit check' 
    };
  }

  const currentTime = new Date().getTime();
  const cooldownMs = cooldownSeconds * 1000;
  const timeThreshold = currentTime - cooldownMs;
  
  let recentOTP = null;
  
  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    recentOTP = await HistorySendMailModel.findOne({
      email: normalizedEmail,
      type: { $in: types },
      timestamps: { $gt: timeThreshold }
    }).sort({ timestamps: -1 });
  } else if (phone) {
    recentOTP = await HistorySendSMSModel.findOne({
      phone,
      type: { $in: types },
      timestamps: { $gt: timeThreshold }
    }).sort({ timestamps: -1 });
  }

  if (recentOTP) {
    const elapsedMs = currentTime - recentOTP.timestamps;
    const remainingSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
    
    const contactType = email ? 'email' : 'phone';
    const message = `A verification code was already sent to your ${contactType}. Please wait ${remainingSeconds} seconds before requesting a new one.`;
    
    if (throwError) {
      throw new BadRequestError(message);
    }
    
    return {
      rateLimited: true,
      remainingSeconds,
      message
    };
  }
  
  return {
    rateLimited: false,
    remainingSeconds: 0,
    message: 'You can request a new OTP'
  };
};

module.exports = {
  checkOTPRateLimit
};