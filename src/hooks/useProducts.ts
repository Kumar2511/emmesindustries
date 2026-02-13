import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  wood_type: string;
  dimensions: string | null;
  description: string | null;
  image_url: string | null;
  in_stock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as Category[];
    },
  });

export const useProducts = (categorySlug?: string) =>
  useQuery({
    queryKey: ["products", categorySlug],
    queryFn: async () => {
      let query = supabase.from("products").select("*, categories(name, slug)");
      if (categorySlug) {
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        if (cat) query = query.eq("category_id", cat.id);
      }
      const { data, error } = await query.order("name");
      if (error) throw error;
      return data as (Product & { categories: { name: string; slug: string } })[];
    },
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Product & { categories: { name: string; slug: string } };
    },
    enabled: !!slug,
  });
