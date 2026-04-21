"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Store as StoreIcon, Package, ArrowRight } from "lucide-react";
import axios from "axios";
import Image from "next/image";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const SearchModal = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ products: any[]; stores: any[] }>({
        products: [],
        stores: []
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults({ products: [], stores: [] });
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
                setResults(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchData, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const onSelect = (url: string) => {
        setOpen(false);
        router.push(url);
    };

    const handleSearch = () => {
        if (query.length < 2) return;
        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    // Add a custom trigger for the navbar input
    useEffect(() => {
        const handleOpenSearch = () => setOpen(true);
        window.addEventListener("open-search", handleOpenSearch);
        return () => window.removeEventListener("open-search", handleOpenSearch);
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput 
                placeholder="Cari produk atau toko favoritmu..." 
                value={query}
                onValueChange={setQuery}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && query.length >= 2) {
                        handleSearch();
                    }
                }}
            />
            <CommandList className="scrollbar-hide">
                <CommandEmpty>
                    {loading ? "Mencari..." : "Hasil tidak ditemukan."}
                </CommandEmpty>
                
                {query.length >= 2 && (
                    <CommandGroup heading="Aksi">
                        <CommandItem 
                            onSelect={handleSearch}
                            className="flex items-center gap-2 cursor-pointer text-sky-600"
                        >
                            <Search className="h-4 w-4" />
                            <span>Cari selengkapnya untuk &quot;{query}&quot;</span>
                        </CommandItem>
                    </CommandGroup>
                )}

                {results.stores.length > 0 && (
                    <CommandGroup heading="Toko">
                        {results.stores.map((store) => (
                            <CommandItem 
                                key={store.id} 
                                onSelect={() => onSelect(`/store/${store.id}`)}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                    <StoreIcon className="h-4 w-4 text-sky-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">{store.name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{store.type}</span>
                                </div>
                                <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {results.products.length > 0 && (
                    <CommandGroup heading="Produk">
                        {results.products.map((product) => (
                            <CommandItem 
                                key={product.id} 
                                onSelect={() => onSelect(`/store/${product.storeId}/product/${product.id}`)}
                                className="flex items-center gap-3 cursor-pointer p-3"
                            >
                                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-800">
                                    {product.variants[0]?.images[0] ? (
                                        <Image 
                                            src={product.variants[0].images[0].url} 
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Package className="h-4 w-4 m-auto text-slate-300" />
                                    )}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-bold line-clamp-1">{product.name}</span>
                                    <div className="flex items-center gap-x-2">
                                        <span className="text-[10px] text-sky-600 font-bold uppercase">{product.category.name}</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                        <span className="text-[10px] text-muted-foreground">IDR {new Intl.NumberFormat("id-ID").format(Number(product.variants[0].price))}</span>
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    );
};
