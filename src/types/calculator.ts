// Tipos de entrada da calculadora
export interface CalculatorInput {
  salePrice: number;
  marketplaceFee: number; // percentual
  shippingCost: number;
  advanceFee: number; // percentual
  ownerCommission: number; // percentual
  applyCommission: boolean;
  commissionBase: 'gross' | 'post-advance';
  productCost: number;
}

// Resultado dos cálculos
export interface CalculationResult {
  p0_salePrice: number;
  p1_afterMarketplace: number;
  p2_afterShipping: number;
  p3_afterAdvance: number;
  p4_afterCommission: number;
  profit: number;
  margin: number;
  marketplaceFeeAmount: number;
  advanceFeeAmount: number;
  commissionAmount: number;
  productCost: number;
  isNegativeProfit: boolean;
}

// Preset salvo no localStorage
export interface CalculatorPreset {
  id: string;
  name: string;
  marketplaceFee: number;
  shippingCost: number;
  advanceFee: number;
  ownerCommission: number;
  applyCommission: boolean;
  commissionBase: 'gross' | 'post-advance';
  createdAt: string;
}

// Estrutura de presets no localStorage
export interface StoredPresets {
  presets: CalculatorPreset[];
  lastUpdated: string;
}

// Valores padrão da calculadora
export const DEFAULT_VALUES: CalculatorInput = {
  salePrice: 250.00,
  marketplaceFee: 16.5,
  shippingCost: 22.00,
  advanceFee: 3.8,
  ownerCommission: 4.0,
  applyCommission: false,
  commissionBase: 'gross',
  productCost: 85.00,
};