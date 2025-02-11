"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const useApi = <T extends (...args: any) => Promise<any>>(apiRequest: T) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (...args: Parameters<T>) => {
      try {
        setLoading(true);
        const resp = await apiRequest(...args);
        setData(resp);
      } catch (error) {
        // @ts-ignore
        if (axios.isAxiosError(error)) {
          console.error(
            "Axios error:", // @ts-ignore
            error.response.data.message || error.message
          );
          // @ts-ignore
          setError(error.response.data.message || error.message);
        } else {
          console.error("unexpected error:", error);
          setError("An unexpected error occured");
        }
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  return { loading, data, error, submit };
};

export default useApi;
