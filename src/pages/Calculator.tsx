import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calculator as CalcIcon } from "lucide-react";

const Calculator = () => {
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [operation, setOperation] = useState<string>("+");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
      setResult(null);
      return;
    }

    switch (operation) {
      case "+":
        setResult(n1 + n2);
        break;
      case "-":
        setResult(n1 - n2);
        break;
      case "*":
        setResult(n1 * n2);
        break;
      case "/":
        setResult(n2 !== 0 ? n1 / n2 : null);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalcIcon className="w-8 h-8 text-sage-600" />
        <h1 className="text-3xl font-semibold text-gray-900">Calculator</h1>
      </div>

      <Card className="p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Number</label>
            <Input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="Enter first number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Operation</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="+">Addition (+)</option>
              <option value="-">Subtraction (-)</option>
              <option value="*">Multiplication (×)</option>
              <option value="/">Division (÷)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Second Number</label>
            <Input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="Enter second number"
            />
          </div>

          <Button 
            onClick={calculate}
            className="w-full bg-sage-500 hover:bg-sage-600"
          >
            Calculate
          </Button>

          {result !== null && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-center text-lg font-medium">
                Result: {result}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Calculator;