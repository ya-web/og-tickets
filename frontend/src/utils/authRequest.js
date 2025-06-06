/**
 * Base URL for authentication-related API endpoints
 * @constant {string}
 */
const API_AUTH_URL = `${process.env.REACT_APP_BACKEND_BASE_URL}api/auth/`;

/**
 * Handles authentication-related API POST requests
 * @private
 * @param {string} endpoint - API endpoint suffix
 * @param {Object} data - Payload to send with the request
 * @param {string} [action='Request'] - Action name for error messages
 * @returns {Promise<Object>} Resolves with parsed JSON response
 * @throws {Error} Throws error with server message or default message
 */
export const makeAuthPostRequest = async (
  endpoint,
  data,
  action = 'Request',
  withCredentials = false
) => {
  if (!endpoint.endsWith('/')) {
    endpoint = endpoint + '/';
  }

  try {
    const response = await fetch(`${API_AUTH_URL}${endpoint}`, {
      method: 'POST',
      ...(withCredentials ? { credentials: 'include' } : {}),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.detail || `${action} failed with status ${response.status}`
      );
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json().catch(() => null);
  } catch (error) {
    // console.error(`Auth Error (${action}):`, error);
    throw error;
  }
};
