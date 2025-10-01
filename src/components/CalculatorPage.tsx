import React, { useState, useEffect } from 'react';
import { CalculatorInput, CalculationResult, DEFAULT_VALUES } from '../types/calculator';
import { calculateProfitAndMargin } from '../utils/calculator';
import { CalculatorForm } from './CalculatorForm';
import { ResultsCard } from './ResultsCard';
import { UtilityControls } from './UtilityControls';
import { HowItWorksSection } from './HowItWorksSection';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function CalculatorPage() {
  const [input, setInput] = useState<CalculatorInput>(DEFAULT_VALUES);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Load from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loadedInput: Partial<CalculatorInput> = {};
    
    Object.keys(DEFAULT_VALUES).forEach(key => {
      const value = urlParams.get(key);
      if (value !== null) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          (loadedInput as any)[key] = numValue;
        }
      }
    });

    if (Object.keys(loadedInput).length > 0) {
      setInput(prev => ({ ...prev, ...loadedInput }));
    }
  }, []);

  // Calculate result whenever input changes
  useEffect(() => {
    const calculationResult = calculateProfitAndMargin(input);
    setResult(calculationResult);
  }, [input]);

  const handleInputChange = (field: keyof CalculatorInput, value: number) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearInputs = () => {
    setInput(DEFAULT_VALUES);
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Calculadora de Venda – DEBAJEYU ML
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Calcule seu lucro e margem com precisão seguindo a ordem exata de deduções
            </p>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form and Controls */}
          <div className="space-y-6">
            <CalculatorForm 
              input={input}
              onInputChange={handleInputChange}
            />
            
            <UtilityControls
              input={input}
              result={result}
              onClearInputs={handleClearInputs}
              onLoadPreset={setInput}
            />
          </div>

          {/* Right Column - Results and Info */}
          <div className="space-y-6">
            {result && (
              <ResultsCard result={result} />
            )}
            
            <HowItWorksSection />
          </div>
        </div>

        {/* Footer */}
        <Card className="bg-white/60 backdrop-blur-sm border-0">
          <CardContent className="text-center py-4">
            <p className="text-sm text-gray-600">
              Calculadora desenvolvida para vendedores do Mercado Livre • 
              Cálculos baseados na ordem oficial de deduções P0→P1→P2→P3→P4
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}