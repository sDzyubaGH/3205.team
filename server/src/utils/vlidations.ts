export const validateEmail = (email: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return email.toLowerCase().match(emailRegex);
};

export const validateNumber = (number: string) => {
  const phoneRegex = /^\d{2}-\d{2}-\d{2}$/;

  return phoneRegex.test(number);
};
