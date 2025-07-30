import { formatPrice, CURRENCY, isFree } from "@/utils/currency";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  price: string | number;
  className?: string;
  showSymbol?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "muted";
}

export const CurrencyDisplay = ({ 
  price, 
  className, 
  showSymbol = true,
  size = "md",
  variant = "default"
}: CurrencyDisplayProps) => {
  const formattedPrice = formatPrice(price);
  const free = typeof price === 'string' && isFree(price);
  
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };
  
  const variantClasses = {
    default: "text-foreground",
    gradient: "bg-gradient-primary bg-clip-text text-transparent",
    muted: "text-muted-foreground"
  };
  
  return (
    <div className={cn(
      "font-bold font-cairo",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {free ? (
        <span className="text-green-600">مجاني</span>
      ) : (
        <>
          {formattedPrice}
          {showSymbol && !formattedPrice.includes(CURRENCY.symbol) && (
            <span className="text-muted-foreground text-sm mr-1">
              {CURRENCY.symbol}
            </span>
          )}
        </>
      )}
    </div>
  );
};

// مكون لعرض معلومات العملة
export const CurrencyInfo = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>العملة:</span>
      <span className="font-medium">{CURRENCY.name}</span>
      <span className="font-mono bg-muted px-2 py-1 rounded">
        {CURRENCY.symbol}
      </span>
    </div>
  );
};