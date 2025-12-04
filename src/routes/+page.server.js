import { supabase } from '$lib/supabaseClient';

export const load = async () => {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return { products: [] };
    }

    return { products };
};
