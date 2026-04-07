export function notFoundHandler(_request, response) {
  response.status(404).json({ error: 'Route not found.' });
}

export function errorHandler(error, _request, response, _next) {
  console.error('[auth][error]', error);

  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    error: error.message || 'Internal server error.',
  });
}
