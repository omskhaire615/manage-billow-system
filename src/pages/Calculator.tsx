import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Calculator = () => {
  const [display, setDisplay] = useState<string>("0");
  const [equation, setEquation] = useState<string>("");

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === "0" ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setEquation(display + " " + op + " ");
    setDisplay("0");
  };

  const handleEquals = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation("");
    } catch (error) {
      setDisplay("Error");
      setEquation("");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(prev => prev + ".");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-semibold text-gray-900">Calculator</h1>
      </div>

      <Card className="max-w-sm mx-auto bg-white rounded-3xl shadow-lg p-6">
        <div className="space-y-6">
          {/* Display */}
          <div className="text-right space-y-1">
            <div className="text-gray-500 text-sm h-5">{equation}</div>
            <Input 
              value={display}
              readOnly
              className="text-4xl text-right border-none focus-visible:ring-0 font-light"
            />
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button
              variant="outline"
              onClick={handleClear}
              className="bg-gray-50 hover:bg-gray-100 text-lg font-normal"
            >
              AC
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOperator("+/-")}
              className="bg-gray-50 hover:bg-gray-100 text-lg font-normal"
            >
              +/-
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOperator("%")}
              className="bg-gray-50 hover:bg-gray-100 text-lg font-normal"
            >
              %
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOperator("/")}
              className="bg-rose-50 hover:bg-rose-100 text-rose-500 text-lg font-normal"
            >
              ÷
            </Button>

            {/* Row 2 */}
            {[7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumber(String(num))}
                className="bg-gray-50 hover:bg-gray-100 text-lg font-normal"
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handleOperator("*")}
              className="bg-rose-50 hover:bg-rose-100 text-rose-500 text-lg font-normal"
            >
              ×
            </Button>

            {/* Row 3 */}
            {[4, 5, 6].map((num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumber(String(num))}
                className="bg-gray-50 hover:bg-gray-100 text-lg font-normal"
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handleOperator("-")}
              className="bg-rose-50 hover:bg-rose-100 text-rose-500 text-lg font-normal"
            >
              −
            </Button>

            {/* Row 4 */}
            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumber(String(num))}
                className="bg-gray-50 hover:bg-gray-100 text-lg font-normal"
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handleOperator("+")}
              className="bg-rose-50 hover:bg-rose-100 text-rose-500 text-lg font-normal"
            >
              +
            </Button>

            {/* Row 5 */}
            <Button
              variant="outline"
              onClick={() => handleNumber("0")}
              className="bg-gray-50 hover:bg-gray-100 text-lg font-normal col-span-1"
            >
              0
            </Button>
            <Button
              variant="outline"
              onClick={handleDecimal}
              className="bg-gray-50 hover:bg-gray-100 text-lg font-normal"
            >
              .
            </Button>
            <Button
              variant="outline"
              onClick={handleEquals}
              className="bg-rose-50 hover:bg-rose-100 text-rose-500 text-lg font-normal col-span-2"
            >
              =
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;