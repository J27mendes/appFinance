export const ok = (body) => {
  return {
    statusCode: 200,
    body,
  };
};

export const created = (body) => {
  return {
    statusCode: 201,
    body,
  };
};

export const badRequest = (body) => {
  return {
    statusCode: 400,
    body,
  };
};

export const unauthorized = () => ({
  statusCode: 401,
  body: {
    message: 'Unauthorized',
  },
});

export const forbidden = () => ({
  statusCode: 403,
  body: {
    message: 'Forbidden',
  },
});

export const notFound = (body) => {
  return {
    statusCode: 404,
    body,
  };
};

export const serverError = () => {
  return {
    statusCode: 500,
    message: 'Internal server error',
  };
};
