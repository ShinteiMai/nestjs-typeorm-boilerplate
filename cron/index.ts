export const getDomain = () => {
  let domain: string;
  switch (process.env.NODE_ENV) {
    case 'development':
      domain = 'http://localhost:8080';
      break;
    case 'production':
      domain = 'https://stronkapp.com';
      break;
    default:
      domain = 'http://stronkapp.com';
      break;
  }

  return domain;
};
export const authenticationData = {
  email: 'test@test.com',
  password: 'testtest',
};

export const registerData = {
  ...authenticationData,
  firstName: 'test',
  lastName: 'test',
};
