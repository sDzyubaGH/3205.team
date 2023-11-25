"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumber = exports.validateEmail = void 0;
const validateEmail = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.toLowerCase().match(emailRegex);
};
exports.validateEmail = validateEmail;
const validateNumber = (number) => {
    const phoneRegex = /^\d{2}-\d{2}-\d{2}$/;
    return phoneRegex.test(number);
};
exports.validateNumber = validateNumber;
