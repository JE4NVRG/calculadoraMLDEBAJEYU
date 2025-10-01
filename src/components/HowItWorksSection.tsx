import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function HowItWorksSection() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">
          Como Calculamos?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="formulas">
            <AccordionTrigger className="text-left">
              Fórmulas e Ordem de Cálculo
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                  <div className="font-bold mb-2">Ordem de Cálculo (P0 → P4):</div>
                  <div>P0 = Preço de venda</div>
                  <div>P1 = P0 - (Taxa marketplace% × P0)</div>
                  <div>P2 = P1 - Frete</div>
                  <div>P3 = P2 - (Taxa antecipação% × P2)</div>
                  <div>P4 = P3 - Comissão 4% (se aplicável)</div>
                  <div className="mt-2 border-t pt-2">
                    <div>Lucro = P4 - Custo do produto</div>
                    <div>Margem (%) = (Lucro ÷ P0) × 100</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Comissão 4% - Duas Opções:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Sobre valor bruto:</strong> P4 = P3 - (4% × P0)</li>
                    <li><strong>Após antecipação:</strong> P4 = P3 - (4% × P3)</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="example">
            <AccordionTrigger className="text-left">
              Exemplo Prático
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-bold mb-2">Caso de Teste:</div>
                  <div>• Preço de venda: R$ 250,00</div>
                  <div>• Taxa marketplace: 16,8%</div>
                  <div>• Frete: R$ 22,00</div>
                  <div>• Taxa antecipação: 3,8%</div>
                  <div>• Sem comissão 4%</div>
                  <div>• Custo: R$ 85,00</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                  <div className="font-bold mb-2">Cálculo Passo a Passo:</div>
                  <div>P0 = R$ 250,00</div>
                  <div>P1 = R$ 250,00 - (16,8% × R$ 250,00) = R$ 250,00 - R$ 42,00 = R$ 208,00</div>
                  <div>P2 = R$ 208,00 - R$ 22,00 = R$ 186,00</div>
                  <div>P3 = R$ 186,00 - (3,8% × R$ 186,00) = R$ 186,00 - R$ 7,07 = R$ 178,93</div>
                  <div>P4 = R$ 178,93 (sem comissão)</div>
                  <div className="mt-2 border-t pt-2">
                    <div>Lucro = R$ 178,93 - R$ 85,00 = R$ 93,93</div>
                    <div>Margem = (R$ 93,93 ÷ R$ 250,00) × 100 = 37,57%</div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="validations">
            <AccordionTrigger className="text-left">
              Validações e Regras
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Validações Aplicadas:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Campos monetários devem ser ≥ R$ 0,00</li>
                    <li>Campos percentuais entre 0% e 100%</li>
                    <li>Alerta "Lucro negativo" quando custo &gt; subtotal</li>
                    <li>Formatação automática BRL (R$ 0.000,00)</li>
                    <li>Arredondamento para 2 casas decimais na exibição</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Funcionalidades:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Cálculo em tempo real conforme digitação</li>
                    <li>Salvar configurações como presets</li>
                    <li>Compartilhar cálculo via URL</li>
                    <li>Copiar resumo detalhado</li>
                    <li>Interface responsiva mobile-first</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}