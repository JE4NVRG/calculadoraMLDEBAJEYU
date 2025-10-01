import { describe, it, expect } from 'vitest';
import { calculateProfitAndMargin } from '../utils/calculator';
import { CalculatorInput } from '../types/calculator';

describe('Calculator Tests', () => {
  it('should calculate the documented test case correctly: R$ 250,00 → Lucro R$ 93,93 | Margem 37,57%', () => {
    const testInput: CalculatorInput = {
      salePrice: 250.00,
      marketplaceFee: 16.8,
      shippingCost: 22.00,
      advanceFee: 3.8,
      hasOwnerCommission: false,
      ownerCommission: 0,
      commissionBase: 'gross',
      productCost: 85.00
    };

    const result = calculateProfitAndMargin(testInput);

    // Validate step-by-step calculation
    expect(result.p0).toBe(250.00);
    expect(result.p1).toBe(208.00); // 250 - (16.8% × 250) = 250 - 42 = 208
    expect(result.p2).toBe(186.00); // 208 - 22 = 186
    expect(result.p3).toBe(178.93); // 186 - (3.8% × 186) = 186 - 7.068 ≈ 178.93
    expect(result.p4).toBe(178.93); // No commission applied
    
    // Validate final results
    expect(result.profit).toBe(93.93); // 178.93 - 85 = 93.93
    expect(result.margin).toBe(37.57); // (93.93 / 250) × 100 = 37.572 ≈ 37.57%
    
    // Validate breakdown
    expect(result.breakdown.marketplaceFeeAmount).toBe(42.00);
    expect(result.breakdown.advanceFeeAmount).toBe(7.07);
    expect(result.breakdown.ownerCommissionAmount).toBe(0);
    
    // Validate no negative profit
    expect(result.hasNegativeProfit).toBe(false);
  });

  it('should handle commission on gross value correctly', () => {
    const testInput: CalculatorInput = {
      salePrice: 100.00,
      marketplaceFee: 10.0,
      shippingCost: 5.00,
      advanceFee: 2.0,
      hasOwnerCommission: true,
      ownerCommission: 4.0,
      commissionBase: 'gross',
      productCost: 50.00
    };

    const result = calculateProfitAndMargin(testInput);

    expect(result.p0).toBe(100.00);
    expect(result.p1).toBe(90.00); // 100 - 10% = 90
    expect(result.p2).toBe(85.00); // 90 - 5 = 85
    expect(result.p3).toBe(83.30); // 85 - (2% × 85) = 85 - 1.7 = 83.30
    expect(result.p4).toBe(79.30); // 83.30 - (4% × 100) = 83.30 - 4 = 79.30
    
    expect(result.profit).toBe(29.30); // 79.30 - 50 = 29.30
    expect(result.margin).toBe(29.30); // (29.30 / 100) × 100 = 29.30%
    
    expect(result.breakdown.ownerCommissionAmount).toBe(4.00);
  });

  it('should handle commission on post-advance value correctly', () => {
    const testInput: CalculatorInput = {
      salePrice: 100.00,
      marketplaceFee: 10.0,
      shippingCost: 5.00,
      advanceFee: 2.0,
      hasOwnerCommission: true,
      ownerCommission: 4.0,
      commissionBase: 'post-advance',
      productCost: 50.00
    };

    const result = calculateProfitAndMargin(testInput);

    expect(result.p0).toBe(100.00);
    expect(result.p1).toBe(90.00); // 100 - 10% = 90
    expect(result.p2).toBe(85.00); // 90 - 5 = 85
    expect(result.p3).toBe(83.30); // 85 - (2% × 85) = 85 - 1.7 = 83.30
    expect(result.p4).toBe(79.97); // 83.30 - (4% × 83.30) = 83.30 - 3.332 = 79.968 ≈ 79.97
    
    expect(result.profit).toBe(29.97); // 79.97 - 50 = 29.97
    expect(result.margin).toBe(29.97); // (29.97 / 100) × 100 = 29.97%
    
    expect(result.breakdown.ownerCommissionAmount).toBe(3.33);
  });

  it('should detect negative profit correctly', () => {
    const testInput: CalculatorInput = {
      salePrice: 100.00,
      marketplaceFee: 20.0,
      shippingCost: 30.00,
      advanceFee: 5.0,
      hasOwnerCommission: false,
      ownerCommission: 0,
      commissionBase: 'gross',
      productCost: 90.00
    };

    const result = calculateProfitAndMargin(testInput);

    expect(result.hasNegativeProfit).toBe(true);
    expect(result.profit).toBeLessThan(0);
  });

  it('should handle zero values correctly', () => {
    const testInput: CalculatorInput = {
      salePrice: 100.00,
      marketplaceFee: 0,
      shippingCost: 0,
      advanceFee: 0,
      hasOwnerCommission: false,
      ownerCommission: 0,
      commissionBase: 'gross',
      productCost: 0
    };

    const result = calculateProfitAndMargin(testInput);

    expect(result.p0).toBe(100.00);
    expect(result.p1).toBe(100.00);
    expect(result.p2).toBe(100.00);
    expect(result.p3).toBe(100.00);
    expect(result.p4).toBe(100.00);
    expect(result.profit).toBe(100.00);
    expect(result.margin).toBe(100.00);
    expect(result.hasNegativeProfit).toBe(false);
  });
});