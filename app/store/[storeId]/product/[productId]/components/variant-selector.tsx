"use client"

import { ProductVariant, Image, Attribute, AttributeValue } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface VariantSelectorProps {
  activeVariant: ProductVariant & {
      attributeValues: (AttributeValue & {
          attribute: Attribute;
      })[];
      images: Image[];
  };
  variants: (ProductVariant & {
    attributeValues: (AttributeValue & {
        attribute: Attribute;
    })[];
    images: Image[];
  })[];
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  activeVariant,
  variants
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const attributesMap = useMemo(() => {
    const map: Record<string, { attribute: Attribute; values: AttributeValue[] }> = {};
    
    variants.forEach(v => {
      v.attributeValues.forEach(av => {
        if (!map[av.attribute.name]) {
          map[av.attribute.name] = {
            attribute: av.attribute,
            values: []
          };
        }
        
        if (!map[av.attribute.name].values.find(existing => existing.id === av.id)) {
          map[av.attribute.name].values.push(av);
        }
      });
    });
    
    return map;
  }, [variants]);

  const onValueClick = (attributeId: string, valueId: string) => {
    const currentSelection: Record<string, string> = {};
    activeVariant.attributeValues.forEach(av => {
        currentSelection[av.attributeId] = av.id;
    });

    const newSelection = {
        ...currentSelection,
        [attributeId]: valueId
    };

    const target = variants.find(v => {
        return Object.entries(newSelection).every(([attrId, valId]) => {
            return v.attributeValues.some(av => av.attributeId === attrId && av.id === valId);
        });
    });

    if (target) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('variantId', target.id);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const categories = Object.values(attributesMap);

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-10 p-4">
      {categories.map((category) => {
        const isExplicitlySelected = !!searchParams.get("variantId");
        const activeValueId = isExplicitlySelected 
            ? activeVariant.attributeValues.find(av => av.attributeId === category.attribute.id)?.id 
            : null;
        
        return (
          <div key={category.attribute.id} className="flex flex-col gap-y-5">
            <div className="flex items-center gap-x-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {category.attribute.name}
                </span>
                <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800" />
            </div>
            
            <div className="flex flex-wrap gap-4">
              {category.values.map((value) => {
                const isActive = activeValueId === value.id;
                
                if (value.value && value.value.startsWith('#')) {
                    return (
                        <motion.div
                            key={value.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onValueClick(category.attribute.id, value.id)}
                            className={cn(
                            "flex items-center gap-x-3 bg-white dark:bg-slate-900 rounded-full px-6 py-3 cursor-pointer transition-all duration-300 border-2 shadow-sm",
                            isActive 
                                ? "border-slate-900 dark:border-white shadow-xl shadow-slate-200 dark:shadow-none z-10 scale-110" 
                                : "border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                            )}
                        >
                            <div 
                                className="h-5 w-5 rounded-full border-2 border-white shadow-inner" 
                                style={{ backgroundColor: value.value }}
                            />
                            <span className={cn(
                                "text-sm font-black tracking-tight",
                                isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                            )}>
                                {value.name}
                            </span>
                        </motion.div>
                    );
                }

                return (
                  <motion.div
                    key={value.id}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onValueClick(category.attribute.id, value.id)}
                    className={cn(
                      "relative rounded-[1.5rem] border-2 bg-white dark:bg-slate-900 px-8 py-5 cursor-pointer transition-all duration-500 group overflow-hidden",
                      isActive 
                        ? "border-slate-900 dark:border-white shadow-2xl shadow-slate-200 dark:shadow-none scale-105 z-10" 
                        : "border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className="relative z-10 flex flex-col">
                        <span className={cn(
                          "text-base font-black tracking-tighter transition-colors",
                          isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                        )}>
                          {value.name}
                        </span>
                    </div>
                    {isActive && (
                        <motion.div 
                            layoutId={`active-bg-${category.attribute.id}`}
                            className="absolute inset-0 bg-slate-900/[0.02] dark:bg-white/[0.05]"
                        />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )
      })}
    </div>
  );
};
