import { useQueryClient } from "@tanstack/react-query";
import React from "react";

const useRefetch = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      type: "active",
    });
  };
};

export default useRefetch;
