  import { useState, useCallback, useRef, useEffect } from "react";

  export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

      //Clean up function
      useEffect(() => {
        console.log('here')
        return () => {
          activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
        };
      }, []);

    const sendRequest = useCallback(
      async (url, method = 'GET', body=null, headers = {}) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
          const response = await fetch(url, {
            method,
            headers,
            body,
            signal: httpAbortCtrl.signal,
          });
          const responseData = await response.json();

          activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !==httpAbortCtrl)
          if (!response.ok) {
            throw new Error(response.message);
          }
          setIsLoading(false);
          return responseData;
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
          console.log(err.message)
          throw err;
        }
      },
      []
    );

    const clearError = () => {
      setError(null);
    };



    return {isLoading, error, sendRequest, clearError} ;
  };
