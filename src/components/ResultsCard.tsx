import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CalculationResult } from '../types/calculator';
import { formatCurrency, formatPercentage } from '../utils/calculator';

interface ResultsCardProps {
  result: CalculationResult;
  commissionBase: 'gross' | 'post-advance';
  applyCommission: boolean;
}

export function ResultsCard({ result, commissionBase, applyCommission }: ResultsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">
          Resultados do Cálculo
        </CardTitle>
        {applyCommission && (
          <div className="flex gap-2">
            <Badge variant={commissionBase === 'gross' ? 'default' : 'secondary'}>
              {commissionBase === 'gross' ? 'BRUTO' : 'PÓS-ANTECIPAÇÃO'}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Breakdown detalhado */}
        <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-3">Resumo em Etapas</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>Valor da venda (P0)</span>
              <span className="font-medium">{formatCurrency(result.p0_salePrice)}</span>
            </div>
            
            <div className="flex justify-between items-center text-red-600">
              <span>(-) Taxa marketplace ({formatCurrency(result.marketplaceFeeAmount)})</span>
              <span className="font-medium">-{formatCurrency(result.marketplaceFeeAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-gray-600">= Subtotal após marketplace</span>
              <span className="font-medium">{formatCurrency(result.p1_afterMarketplace)}</span>
            </div>
            
            <div className="flex justify-between items-center text-red-600">
              <span>(-) Frete</span>
              <span className="font-medium">-{formatCurrency(result.p2_afterShipping - result.p1_afterMarketplace)}</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-gray-600">= Subtotal após frete</span>
              <span className="font-medium">{formatCurrency(result.p2_afterShipping)}</span>
            </div>
            
            <div className="flex justify-between items-center text-red-600">
              <span>(-) Taxa de antecipação ({formatCurrency(result.advanceFeeAmount)})</span>
              <span className="font-medium">-{formatCurrency(result.advanceFeeAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-gray-600">= Subtotal após antecipação</span>
              <span className="font-medium">{formatCurrency(result.p3_afterAdvance)}</span>
            </div>
            
            {applyCommission && result.commissionAmount > 0 && (
              <>
                <div className="flex justify-between items-center text-red-600">
                  <span>
                    (-) Comissão 4% 
                    <span className="text-xs text-gray-500 ml-1">
                      ({commissionBase === 'gross' ? 'sobre valor bruto' : 'sobre pós-antecipação'})
                    </span>
                  </span>
                  <span className="font-medium">-{formatCurrency(result.commissionAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="text-gray-600">= Subtotal após comissão</span>
                  <span className="font-medium">{formatCurrency(result.p4_afterCommission)}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center text-red-600 pt-2">
              <span>(-) Custo do produto</span>
              <span className="font-medium">-{formatCurrency(result.productCost)}</span>
            </div>
          </div>
        </div>

        {/* Resultados principais */}
        <div className="space-y-4 pt-4">
          <div className="text-center space-y-2">
            <div className={`text-3xl font-bold ${result.isNegativeProfit ? 'text-red-500' : 'text-green-600'}`}>
              Lucro: {formatCurrency(result.profit)}
            </div>
            {result.isNegativeProfit && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
                ⚠️ Lucro negativo - Custo maior que o subtotal após taxas
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className={`text-xl font-semibold ${result.isNegativeProfit ? 'text-red-500' : 'text-blue-600'}`}>
              Margem: {formatPercentage(result.margin)}
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
          <div className="space-y-1">
            <span className="text-gray-600">Total de taxas:</span>
            <div className="font-medium">
              {formatCurrency(
                result.marketplaceFeeAmount + 
                result.advanceFeeAmount + 
                result.commissionAmount +
                (result.p1_afterMarketplace - result.p2_afterShipping) // frete
              )}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600">Valor líquido:</span>
            <div className="font-medium">{formatCurrency(result.p4_afterCommission)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}