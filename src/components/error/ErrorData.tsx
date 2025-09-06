import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

const ErrorData = () => {
  return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorData;
