// API utility functions

// Get API URL from environment variable
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:4000';
};

// Build API URL correctly, handling trailing slashes
export const buildApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl().replace(/\/$/, ''); // Remove trailing slash
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Debug function to log current API configuration
export const logApiConfig = () => {
  console.log('API Configuration:', {
    BASE_URL: getApiBaseUrl(),
    UPLOAD_URL: buildApiUrl('/upload'),
    GENERATE_URL: buildApiUrl('/generate-questions'),
    ENV_VAR: process.env.REACT_APP_API_URL
  });
}; 