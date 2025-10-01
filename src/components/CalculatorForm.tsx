import React, { useState, useEffect } from 'react';
import { CalculatorInput } from '../types/calculator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { applyCurrencyMask, applyPercentageMask, parseCurrency, parsePercentage } from '../utils/calculator';

interface CalculatorFormProps {
  input: CalculatorInput;
  onInputChange: (field: keyof CalculatorInput, value: number) => void;
}

export function CalculatorForm({ input, onInputChange }: CalculatorFormProps) {
  // Estados locais para controlar os valores formatados dos inputs
  const [displayValues, setDisplayValues] = useState({
    salePrice: '',
    marketplaceFee: '',
    shippingCost: '',
    advanceFee: '',
    ownerCommission: '',
    productCost: ''
  });

  // Atualizar valores de exibição quando o input muda
  useEffect(() => {
    setDisplayValues({
      salePrice: input.salePrice > 0 ? applyCurrencyMask((input.salePrice * 100).toString()) : '',
      marketplaceFee: input.marketplaceFee > 0 ? input.marketplaceFee.toString().replace('.', ',') : '',
      shippingCost: input.shippingCost > 0 ? applyCurrencyMask((input.shippingCost * 100).toString()) : '',
      advanceFee: input.advanceFee > 0 ? input.advanceFee.toString().replace('.', ',') : '',
      ownerCommission: input.ownerCommission > 0 ? input.ownerCommission.toString().replace('.', ',') : '',
      productCost: input.productCost > 0 ? applyCurrencyMask((input.productCost * 100).toString()) : ''
    });
  }, [input]);

  const handleCurrencyChange = (field: keyof CalculatorInput, value: string) => {
    const maskedValue = applyCurrencyMask(value);
    setDisplayValues(prev => ({ ...prev, [field]: maskedValue }));
    
    const numericValue = parseCurrency(maskedValue);
    onInputChange(field, numericValue);
  };

  const handlePercentageChange = (field: keyof CalculatorInput, value: string) => {
    const maskedValue = applyPercentageMask(value);
    setDisplayValues(prev => ({ ...prev, [field]: maskedValue }));
    
    const numericValue = parsePercentage(maskedValue);
    onInputChange(field, numericValue);
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-700">
          Dados da Venda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preço de venda */}
        <div className="space-y-2">
          <Label htmlFor="salePrice" className="text-sm font-medium">
            Preço de venda *
          </Label>
          <Input
            id="salePrice"
            type="text"
            placeholder="R$ 0,00"
            value={displayValues.salePrice}
            onChange={(e) => handleCurrencyChange('salePrice', e.target.value)}
            className="text-lg font-medium"
          />
        </div>

        {/* Taxa do marketplace */}
        <div className="space-y-2">
          <Label htmlFor="marketplaceFee" className="text-sm font-medium">
            Taxa do marketplace (%) *
          </Label>
          <Input
            id="marketplaceFee"
            type="text"
            placeholder="16,8"
            value={displayValues.marketplaceFee}
            onChange={(e) => handlePercentageChange('marketplaceFee', e.target.value)}
          />
        </div>

        {/* Frete */}
        <div className="space-y-2">
          <Label htmlFor="shippingCost" className="text-sm font-medium">
            Frete
          </Label>
          <Input
            id="shippingCost"
            type="text"
            placeholder="R$ 0,00"
            value={displayValues.shippingCost}
            onChange={(e) => handleCurrencyChange('shippingCost', e.target.value)}
          />
        </div>

        {/* Taxa de antecipação */}
        <div className="space-y-2">
          <Label htmlFor="advanceFee" className="text-sm font-medium">
            Taxa de antecipação (%)
          </Label>
          <Input
            id="advanceFee"
            type="text"
            placeholder="3,8"
            value={displayValues.advanceFee}
            onChange={(e) => handlePercentageChange('advanceFee', e.target.value)}
          />
        </div>

        {/* Comissão do proprietário */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Aplicar comissão 4%?
            </Label>
            <Select
              value={input.hasOwnerCommission ? 'yes' : 'no'}
              onValueChange={(value) => {
                onInputChange('hasOwnerCommission', value === 'yes' ? true : false);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">Não</SelectItem>
                <SelectItem value="yes">Sim</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {input.hasOwnerCommission && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ownerCommission" className="text-sm font-medium">
                  Percentual da comissão (%)
                </Label>
                <Input
                  id="ownerCommission"
                  type="text"
                  placeholder="4,0"
                  value={displayValues.ownerCommission}
                  onChange={(e) => handlePercentageChange('ownerCommission', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Base de cálculo da comissão
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="commissionBase"
                      value="gross"
                      checked={input.commissionBase === 'gross'}
                      onChange={() => onInputChange('commissionBase', 'gross' as any)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Sobre valor bruto</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="commissionBase"
                      value="post-advance"
                      checked={input.commissionBase === 'post-advance'}
                      onChange={() => onInputChange('commissionBase', 'post-advance' as any)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Após antecipação</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Custo do produto */}
        <div className="space-y-2">
          <Label htmlFor="productCost" className="text-sm font-medium">
            Custo do produto *
          </Label>
          <Input
            id="productCost"
            type="text"
            placeholder="R$ 0,00"
            value={displayValues.productCost}
            onChange={(e) => handleCurrencyChange('productCost', e.target.value)}
            className="font-medium"
          />
        </div>
      </CardContent>
    </Card>
  );
}