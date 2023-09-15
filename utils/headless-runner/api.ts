import wretch from 'wretch';

export const apiUrl = 'http://localhost:3000';

export const createApi = () => {
  return wretch(apiUrl);
};

export const defaultApi = createApi();
