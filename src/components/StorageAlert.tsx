
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StorageAlertProps {
  usingLocalStorage: boolean;
}

export const StorageAlert = ({ usingLocalStorage }: StorageAlertProps) => {
  if (!usingLocalStorage) return null;
  
  return (
    <Alert className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-700">Using Local Storage</AlertTitle>
      <AlertDescription className="text-amber-700">
        MongoDB connection is not available. Your data is stored in your browser and will be lost if you clear browser data.
        Check MongoDB API credentials in storage.ts.
      </AlertDescription>
    </Alert>
  );
};
