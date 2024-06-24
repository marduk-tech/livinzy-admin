import { notification } from "antd";

interface ValidationError {
  errorFields: { name: string; errors: string[] }[];
}

function isValidationError(error: unknown): error is ValidationError {
  return typeof error === "object" && error !== null && "errorFields" in error;
}

export const useHandleError = () => {
  const handleError = (error: unknown) => {
    if (isValidationError(error)) {
      console.log("Validation Failed:", error.errorFields);
      notification.error({
        message: "Validation Failed",
        description: error.errorFields
          .map((field) => field.errors.join(", "))
          .join(", "),
      });
    } else {
      console.log("An unexpected error occurred:", error);
      notification.error({
        message: "An unexpected error occurred",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return { handleError };
};
