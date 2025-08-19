// hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios';

export default function useApi(baseURL) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic request handler
  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        baseURL,
        ...config
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || { message: 'An error occurred' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  // Convenience methods
  const get = useCallback((endpoint, params) => 
    request({ url: endpoint, method: 'get', params }), 
    [request]
  );

  const post = useCallback((endpoint, body) => 
    request({ url: endpoint, method: 'post', data: body }), 
    [request]
  );

  const put = useCallback((endpoint, body) => 
    request({ url: endpoint, method: 'put', data: body }), 
    [request]
  );

  const del = useCallback((endpoint) => 
    request({ url: endpoint, method: 'delete' }), 
    [request]
  );

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    request // Direct access to full config requests
  };
}