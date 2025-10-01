import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, Trash2, Save, Download, Share } from 'lucide-react';
import { CalculatorInput, CalculatorPreset, StoredPresets } from '../types/calculator';
import { formatCurrency, formatPercentage } from '../utils/calculator';

interface UtilityControlsProps {
  values: CalculatorInput;
  onClear: () => void;
  onLoadPreset: (preset: CalculatorPreset) => void;
  result: any;
}

export function UtilityControls({ values, onClear, onLoadPreset, result }: UtilityControlsProps) {
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<CalculatorPreset[]>([]);
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Carregar presets do localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('calculadora-ml-presets');
    if (stored) {
      try {
        const data: StoredPresets = JSON.parse(stored);
        setPresets(data.presets);
      } catch (error) {
        console.error('Erro ao carregar presets:', error);
      }
    }
  }, []);

  // Salvar preset
  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: CalculatorPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      marketplaceFee: values.marketplaceFee,
      shippingCost: values.shippingCost,
      advanceFee: values.advanceFee,
      ownerCommission: values.ownerCommission,
      applyCommission: values.applyCommission,
      commissionBase: values.commissionBase,
      createdAt: new Date().toISOString(),
    };

    const updatedPresets = [...presets, newPreset];
    const storedData: StoredPresets = {
      presets: updatedPresets,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem('calculadora-ml-presets', JSON.stringify(storedData));
    setPresets(updatedPresets);
    setPresetName('');
    setShowSaveForm(false);
  };

  // Carregar preset
  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      onLoadPreset(preset);
    }
  };

  // Deletar preset
  const handleDeletePreset = (presetId: string) => {
    const updatedPresets = presets.filter(p => p.id !== presetId);
    const storedData: StoredPresets = {
      presets: updatedPresets,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem('calculadora-ml-presets', JSON.stringify(storedData));
    setPresets(updatedPresets);
  };

  // Copiar resumo
  const handleCopyResume = async () => {
    const resume = `
CALCULADORA DE VENDA - DEBAJEYU ML
=====================================

DADOS DA VENDA:
• Preço de venda: ${formatCurrency(values.salePrice)}
• Taxa marketplace: ${values.marketplaceFee}%
• Frete: ${formatCurrency(values.shippingCost)}
• Taxa antecipação: ${values.advanceFee}%
• Comissão 4%: ${values.applyCommission ? 'Sim' : 'Não'}${values.applyCommission ? ` (${values.commissionBase === 'gross' ? 'sobre valor bruto' : 'sobre pós-antecipação'})` : ''}
• Custo do produto: ${formatCurrency(values.productCost)}

BREAKDOWN DO CÁLCULO:
• Valor da venda (P0): ${formatCurrency(result.p0_salePrice)}
• (-) Taxa marketplace: -${formatCurrency(result.marketplaceFeeAmount)}
• = Após marketplace: ${formatCurrency(result.p1_afterMarketplace)}
• (-) Frete: -${formatCurrency(result.p1_afterMarketplace - result.p2_afterShipping)}
• = Após frete: ${formatCurrency(result.p2_afterShipping)}
• (-) Taxa antecipação: -${formatCurrency(result.advanceFeeAmount)}
• = Após antecipação: ${formatCurrency(result.p3_afterAdvance)}${values.applyCommission && result.commissionAmount > 0 ? `
• (-) Comissão 4%: -${formatCurrency(result.commissionAmount)}
• = Após comissão: ${formatCurrency(result.p4_afterCommission)}` : ''}
• (-) Custo produto: -${formatCurrency(values.productCost)}

RESULTADO FINAL:
• LUCRO: ${formatCurrency(result.profit)}
• MARGEM: ${formatPercentage(result.margin)}

Gerado em: ${new Date().toLocaleString('pt-BR')}
    `.trim();

    try {
      await navigator.clipboard.writeText(resume);
      // Aqui você pode adicionar um toast de sucesso
      alert('Resumo copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar resumo');
    }
  };

  // Compartilhar via URL
  const handleShare = () => {
    const params = new URLSearchParams({
      preco: values.salePrice.toString(),
      taxa_ml: values.marketplaceFee.toString(),
      frete: values.shippingCost.toString(),
      antecipacao: values.advanceFee.toString(),
      comissao: values.ownerCommission.toString(),
      aplicar_comissao: values.applyCommission.toString(),
      base_comissao: values.commissionBase,
      custo: values.productCost.toString(),
    });

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    try {
      navigator.clipboard.writeText(shareUrl);
      alert('Link de compartilhamento copiado!');
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      // Fallback: mostrar o link em um prompt
      prompt('Copie o link abaixo:', shareUrl);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          Controles Utilitários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botões principais */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleCopyResume}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copiar Resumo
          </Button>
          
          <Button
            onClick={onClear}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share className="w-4 h-4" />
            Compartilhar
          </Button>
        </div>

        {/* Gerenciamento de presets */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-700">Presets Salvos</h4>
          
          {/* Carregar preset */}
          {presets.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Carregar preset:</Label>
              <div className="flex gap-2">
                <Select onValueChange={handleLoadPreset}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Lista de presets com opção de deletar */}
          {presets.length > 0 && (
            <div className="space-y-1">
              {presets.map((preset) => (
                <div key={preset.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                  <span>{preset.name}</span>
                  <Button
                    onClick={() => handleDeletePreset(preset.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Salvar novo preset */}
          <div className="space-y-2">
            {!showSaveForm ? (
              <Button
                onClick={() => setShowSaveForm(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Preset
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm">Nome do preset:</Label>
                <div className="flex gap-2">
                  <Input
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Ex: Loja Principal"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSavePreset}
                    size="sm"
                    disabled={!presetName.trim()}
                  >
                    Salvar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSaveForm(false);
                      setPresetName('');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}