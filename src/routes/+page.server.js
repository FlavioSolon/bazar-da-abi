import { supabase } from '$lib/supabaseClient';

export const load = async () => {
    // Try to fetch with position ordering first
    let { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('position', { ascending: true })
        .order('created_at', { ascending: false });

    // If error (likely missing column), fallback to default ordering
    if (error) {
        console.warn('Error fetching with position, falling back to default:', error.message);
        const result = await supabase
            .from('products')
            .select('*')
            .eq('is_visible', true)
            .order('created_at', { ascending: false });

        products = result.data;
        error = result.error;
    }

    if (error) {
        console.error('Error fetching products:', error);
        return { products: [] };
    }

    return { products };
};
