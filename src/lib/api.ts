import { toast } from "sonner";

export const handleApiError = (error: any, defaultMessage: string) => {
  console.error(error);
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    toast.error("Network error. Please check your internet connection.");
  } else {
    toast.error(error.message || defaultMessage);
  }
};
