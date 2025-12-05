import { supabase } from '$lib/supabaseClient';
import { fail } from '@sveltejs/kit';

export const load = async ({ setHeaders }) => {
    setHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return { products: [] };
    }

    return { products };
};

export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title');
        const price = formData.get('price');
        const image_url = formData.get('image_url');
        const buy_link = formData.get('buy_link');
        const category = formData.get('category');

        if (!title || !price || !image_url || !buy_link || !category) {
            return fail(400, { message: 'Por favor, preencha todos os campos.' });
        }

        const { error } = await supabase
            .from('products')
            .insert([{ title, price, image_url, buy_link, category, is_visible: true }]);

        if (error) {
            console.error('Error creating product:', error);
            return fail(500, { message: 'Erro ao criar produto. Tente novamente.' });
        }

        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return fail(400, { message: 'ID do produto inválido.' });
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return fail(500, { message: 'Erro ao deletar produto.' });
        }

        return { success: true };
    },

    toggleVisibility: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        if (!id) {
            return fail(400, { message: 'ID do produto inválido.' });
        }

        const is_visible = formData.get('is_visible') === 'true';

        const { error } = await supabase
            .from('products')
            .update({ is_visible: !is_visible })
            .eq('id', id);

        if (error) {
            console.error('Error toggling visibility:', error);
            return fail(500, { message: 'Erro ao alterar visibilidade.' });
        }

        return { success: true };
    }
};
