import { TErrorSource, TGenericErrorResponse } from "./interface/error";


const handleDuplicateError = (err: any): TGenericErrorResponse => {
    // Regex to extract text inside double quotes
    const regex = /"([^"]+)"/;
    const match = err.message.match(regex);
    const extractedMessage = match && match[1];
    const errorSource: TErrorSource = [
      {
        path: '',
        message: `${extractedMessage} is already Exists`,
      },
    ];

    const statusCode = 400;
    return {
      statusCode,
      message: err?.message,
      errorSource,
    };
  };

  export default handleDuplicateError