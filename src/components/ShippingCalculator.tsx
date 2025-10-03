import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, MapPin, DollarSign } from 'lucide-react';
import { z } from 'zod';

// Validation schema for postal code (flexible format for international codes)
const postalCodeSchema = z.string()
  .trim()
  .max(20, 'Código postal demasiado largo')
  .regex(/^[A-Za-z0-9\s-]+$/, 'Código postal inválido')
  .optional();

interface ShippingCalculatorProps {
  productPrice: number;
  onShippingCalculated: (shippingCost: number) => void;
}

export const ShippingCalculator = ({ productPrice, onShippingCalculated }: ShippingCalculatorProps) => {
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Shipping rates from Montreal, Canada (approximate)
  const shippingRates = {
    'Canada': 15,
    'United States': 25,
    'United Kingdom': 35,
    'France': 35,
    'Germany': 35,
    'Spain': 35,
    'Italy': 35,
    'Australia': 45,
    'Japan': 45,
    'Brazil': 40,
    'Mexico': 30,
    'Argentina': 40,
    'Other': 50
  };

  const handleCalculateShipping = async () => {
    if (!country) return;
    
    setIsCalculating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const cost = shippingRates[country as keyof typeof shippingRates] || shippingRates.Other;
      setShippingCost(cost);
      onShippingCalculated(cost);
      setIsCalculating(false);
    }, 1000);
  };

  const getTotalPrice = () => {
    return shippingCost ? productPrice + shippingCost : productPrice;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Calculadora de Envío desde Montreal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">País de destino</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Canada">Canadá</SelectItem>
                <SelectItem value="United States">Estados Unidos</SelectItem>
                <SelectItem value="United Kingdom">Reino Unido</SelectItem>
                <SelectItem value="France">Francia</SelectItem>
                <SelectItem value="Germany">Alemania</SelectItem>
                <SelectItem value="Spain">España</SelectItem>
                <SelectItem value="Italy">Italia</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Japan">Japón</SelectItem>
                <SelectItem value="Brazil">Brasil</SelectItem>
                <SelectItem value="Mexico">México</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Other">Otro país</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Código postal (opcional)</label>
            <Input
              type="text"
              placeholder="Ej: H1A 1A1"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              maxLength={20}
              pattern="[A-Za-z0-9\s-]+"
            />
          </div>
        </div>

        <Button
          onClick={handleCalculateShipping}
          disabled={!country || isCalculating}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isCalculating ? 'Calculando...' : 'Calcular Envío'}
        </Button>

        {shippingCost && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Precio del producto:</span>
              <span className="font-medium">${productPrice.toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Envío a {country}:</span>
              <span className="font-medium">${shippingCost.toFixed(2)} CAD</span>
            </div>
            <div className="border-t border-primary/20 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary">Total:</span>
                <span className="font-bold text-lg text-primary">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  {getTotalPrice().toFixed(2)} CAD
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              *Tiempo estimado de entrega: 7-14 días hábiles. Envío con seguimiento incluido.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>📦 Todos los envíos incluyen seguro y número de seguimiento</p>
          <p>🌍 Envío mundial disponible desde Montreal, Canadá</p>
          <p>💝 Empaque especial para proteger cada pieza artesanal</p>
        </div>
      </CardContent>
    </Card>
  );
};