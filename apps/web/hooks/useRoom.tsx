import axios from "axios";
// @ts-ignore
import { AxiosResponse } from "axios";

import { useEffect, useState } from "react";

type ResponseObject = {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
};

const useRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const fetchRoomDetails = async (): Promise<ResponseObject | null> => {
    try {
      const response: AxiosResponse<ResponseObject> = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/rooms`,
        {
          withCredentials: true,
        }
      );
      return response.data;
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
    }
    return null;
  };

  useEffect(() => {
    console.log("effect running from useRoom");
    setLoading(true);
    fetchRoomDetails()
      .then((response) => {
        console.log(response);
        setData(response?.data.rooms);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error, refresh: fetchRoomDetails };
};

export { useRoom };
