import { CalculatorInput, CalculationResult } from '../types/calculator';

/**
 * Função principal de cálculo seguindo a ordem P0→P1→P2→P3→P4
 * conforme especificado na documentação
 */
export function calculateProfitAndMargin(input: CalculatorInput): CalculationResult {
  // P0 = Preço de venda
  const p0 = input.salePrice;

  // P1 = P0 - (Taxa marketplace% * P0)
  const marketplaceFeeAmount = Math.round((input.marketplaceFee / 100) * p0 * 100) / 100;
  const p1 = Math.round((p0 - marketplaceFeeAmount) * 100) / 100;

  // P2 = P1 - Frete
  const p2 = Math.round((p1 - input.shippingCost) * 100) / 100;

  // P3 = P2 - (Taxa antecipação% * P2)
  const advanceFeeAmount = Math.round((input.advanceFee / 100) * p2 * 100) / 100;
  const p3 = Math.round((p2 - advanceFeeAmount) * 100) / 100;

  // P4 = Aplicação opcional da comissão 4%
  let ownerCommissionAmount = 0;
  let p4 = p3;

  if (input.applyCommission) {
    if (input.commissionBase === 'gross') {
      // Sobre o valor bruto: P4 = P3 - (4% * P0)
      ownerCommissionAmount = Math.round((input.ownerCommission / 100) * p0 * 100) / 100;
    } else {
      // Após antecipação: P4 = P3 - (4% * P3)
      ownerCommissionAmount = Math.round((input.ownerCommission / 100) * p3 * 100) / 100;
    }
    p4 = Math.round((p3 - ownerCommissionAmount) * 100) / 100;
  }

  // Lucro = P4 - Custo do produto
  const profit = Math.round((p4 - input.productCost) * 100) / 100;

  // Margem (%) = (Lucro / P0) * 100
  const margin = p0 > 0 ? Math.round((profit / p0) * 10000) / 100 : 0;

  // Verificar se o lucro é negativo
  const hasNegativeProfit = profit < 0;

  return {
    p0_salePrice: p0,
    p1_afterMarketplace: p1,
    p2_afterShipping: p2,
    p3_afterAdvance: p3,
    p4_afterCommission: p4,
    profit,
    margin,
    marketplaceFeeAmount,
    advanceFeeAmount,
    commissionAmount: ownerCommissionAmount,
    productCost: input.productCost,
    isNegativeProfit: hasNegativeProfit,
  };
}

/**
 * Formatar valor em reais (BRL)
 */
export function formatCurrency(value: number): string {
  // Verificar se o valor é válido
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formatar porcentagem
 */
export function formatPercentage(value: number): string {
  // Verificar se o valor é válido
  if (typeof value !== 'number' || isNaN(value)) {
    return '0,00%';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/**
 * Parsear valor monetário de string para number
 */
export function parseCurrency(value: string): number {
  // Remove todos os caracteres exceto números, vírgula e ponto
  const cleanValue = value.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto para conversão
  const normalizedValue = cleanValue.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parsear porcentagem de string para number
 */
export function parsePercentage(value: string): number {
  const cleanValue = value.replace(/[^\d,.-]/g, '');
  const normalizedValue = cleanValue.replace(',', '.');
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), 100);
}

/**
 * Aplicar máscara de moeda brasileira
 */
export function applyCurrencyMask(value: string): string {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para centavos
  const amount = parseInt(numbers) / 100;
  
  // Formata como moeda
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Aplicar máscara de porcentagem
 */
export function applyPercentageMask(value: string): string {
  // Remove tudo exceto números, vírgula e ponto
  const cleanValue = value.replace(/[^\d,.-]/g, '');
  
  if (!cleanValue) return '';
  
  // Limita a 2 casas decimais
  const parts = cleanValue.split(/[,.]/);
  if (parts.length > 2) {
    return parts[0] + ',' + parts[1].substring(0, 2);
  }
  
  return cleanValue.replace('.', ',');
}