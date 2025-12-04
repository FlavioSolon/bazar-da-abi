import { supabase } from '$lib/supabaseClient';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
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

        const { error } = await supabase
            .from('products')
            .insert([{ title, price, image_url, buy_link, category, is_visible: true }]);

        if (error) {
            return fail(500, { message: 'Erro ao criar produto', error });
        }

        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            return fail(500, { message: 'Erro ao deletar produto', error });
        }

        return { success: true };
    },

    toggleVisibility: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const is_visible = formData.get('is_visible') === 'true';

        const { error } = await supabase
            .from('products')
            .update({ is_visible: !is_visible })
            .eq('id', id);

        if (error) {
            return fail(500, { message: 'Erro ao alterar visibilidade', error });
        }

        return { success: true };
    }
};
