"use client";

interface StepperProps {
    currentStep: number;
    steps: string[];
}

/*
Stepper - Indicatore visuale progresso conversione
Mostra step corrente, completati e futuri
*/
export default function Stepper({ currentStep, steps }: StepperProps) {
    return (
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-start sm:items-center justify-center w-full mb-8">
            {steps.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <div key={stepNumber} className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isActive
                                    ? "bg-blue-600 text-white"
                                    : isCompleted
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            <span className="font-bold">{stepNumber}</span>
                        </div>
                        <span
                            className={`ml-3 mr-8 font-medium ${isActive || isCompleted ? "text-gray-800" : "text-gray-400"
                                }`}
                        >
                            {label}
                        </span>
                        {stepNumber < steps.length && (
                            <div className="w-20 h-1 bg-gray-200 hidden sm:block" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
