import { supabase, s3 } from '$lib/supabaseClient';
import { fail } from '@sveltejs/kit';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
        const buy_link = formData.get('buy_link');
        const category = formData.get('category');

        const image1File = formData.get('image_1');
        const image2File = formData.get('image_2');
        const image3File = formData.get('image_3');

        if (!title || !price || !buy_link || !category || !image1File || image1File.size === 0) {
            return fail(400, { message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        const uploadFile = async (file) => {
            if (!file || file.size === 0) return null;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            try {
                await s3.send(new PutObjectCommand({
                    Bucket: 'products', // Assuming 'products' bucket exists
                    Key: fileName,
                    Body: buffer,
                    ContentType: file.type,
                    ACL: 'public-read' // Ensure file is public
                }));

                // Construct public URL
                // Format: https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[key]
                // Or use the endpoint provided? The endpoint is for S3 API.
                // Supabase public URL is usually:
                // https://lzhkllanoocytcspscqc.supabase.co/storage/v1/object/public/products/fileName
                return `https://lzhkllanoocytcspscqc.supabase.co/storage/v1/object/public/products/${fileName}`;
            } catch (err) {
                console.error('S3 Upload Error:', err);
                throw err;
            }
        };

        let image_1, image_2, image_3;

        try {
            image_1 = await uploadFile(image1File);
            image_2 = await uploadFile(image2File);
            image_3 = await uploadFile(image3File);
        } catch (err) {
            return fail(500, { message: 'Erro ao fazer upload da imagem.' });
        }

        const { error } = await supabase
            .from('products')
            .insert([{
                title,
                price,
                image_1,
                image_2,
                image_3,
                buy_link,
                category,
                is_visible: true
            }]);

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
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const price = formData.get('price');
        const buy_link = formData.get('buy_link');
        const category = formData.get('category');

        const image1File = formData.get('image_1');
        const image2File = formData.get('image_2');
        const image3File = formData.get('image_3');

        if (!id || !title || !price || !buy_link || !category) {
            return fail(400, { message: 'Por favor, preencha todos os campos obrigatórios.' });
        }

        const uploadFile = async (file) => {
            if (!file || file.size === 0) return null;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            try {
                await s3.send(new PutObjectCommand({
                    Bucket: 'products',
                    Key: fileName,
                    Body: buffer,
                    ContentType: file.type,
                    ACL: 'public-read'
                }));
                return `https://lzhkllanoocytcspscqc.supabase.co/storage/v1/object/public/products/${fileName}`;
            } catch (err) {
                console.error('S3 Upload Error:', err);
                throw err;
            }
        };

        const updates = {
            title,
            price,
            buy_link,
            category
        };

        try {
            if (image1File && image1File.size > 0) {
                updates.image_1 = await uploadFile(image1File);
            }
            if (image2File && image2File.size > 0) {
                updates.image_2 = await uploadFile(image2File);
            }
            if (image3File && image3File.size > 0) {
                updates.image_3 = await uploadFile(image3File);
            }
        } catch (err) {
            return fail(500, { message: 'Erro ao fazer upload da imagem.' });
        }

        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error);
            return fail(500, { message: 'Erro ao atualizar produto.' });
        }

        return { success: true };
    },

    updateOrder: async ({ request }) => {
        const formData = await request.formData();
        const orderJson = formData.get('order')?.toString();

        if (!orderJson) {
            return fail(400, { message: 'Dados de ordenação inválidos.' });
        }

        let order;
        try {
            order = JSON.parse(orderJson);
        } catch (e) {
            return fail(400, { message: 'Formato de dados inválido.' });
        }

        // Use upsert to update multiple rows efficiently if possible, 
        // but Supabase/PostgREST doesn't support bulk update with different values easily in one query without a function.
        // We can loop. Since it's admin only and not high traffic, it's acceptable.
        // Or we can use a stored procedure if performance is an issue.
        // For < 100 items, looping is fine.

        // CORREÇÃO:
        // Em vez de usar upsert (que exige todos os campos obrigatórios),
        // vamos percorrer a lista e atualizar apenas a posição de cada ID.

        const updates = order.map(async (item) => {
            return supabase
                .from('products')
                .update({ position: item.position }) // Só muda a posição
                .eq('id', item.id); // Onde o ID for igual
        });

        // Promise.all faz todos os updates rodarem "ao mesmo tempo" (paralelo)
        const results = await Promise.all(updates);

        // Verifica se algum deu erro
        const hasError = results.some(result => result.error);

        if (hasError) {
            console.error('Erro ao salvar a ordem.');
            return fail(500, { message: 'Erro ao salvar a ordem.' });
        }

        return { success: true };
    }
};
