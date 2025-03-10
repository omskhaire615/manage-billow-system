
import React from "react";
import { AlertCircle, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StorageAlertProps {
  usingLocalStorage: boolean;
}

export const StorageAlert = ({ usingLocalStorage }: StorageAlertProps) => {
  if (!usingLocalStorage) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Database className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-700">Connected to MongoDB</AlertTitle>
        <AlertDescription className="text-green-700">
          Your data is being stored in MongoDB Atlas cloud database.
        </AlertDescription>
      </Alert>
    );
  }
  
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
