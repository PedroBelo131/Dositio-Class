/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';
export default async function categories(app, options) {
    const InvalidcategoriesError = createError('InvalidcategoriesError', 'categoria Inválido.', 400);

    const categories = app.mongo.db.collection('categories');
    const products = app.mongo.db.collection('products');

    app.get('/categories', 
        async (request, reply) => {
            request.log.info(categories);
        return await categories.find().toArray();
    });

    app.post('/categories', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' }
                },
                required: ['name']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let product = request.body;
        
        await categories.insertOne(product);

        return reply.code(201).send();
    });

    app.put('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        let product = request.body;
        
        await categories.updateOne({_id: new app.mongo.ObjectId(id)}, {
            $set: {
                name: product.name,
                qtd: product.qtd
            }
        });
        
        return reply.code(204).send();;
    });

    app.delete('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        
        await categories.deleteOne({_id: new app.mongo.ObjectId(id)});
        
        return reply.code(204).send();;
    });

    app.get('categories/:id/products', {
            config:{
                logMe: true
            }
        }, async (request, reply) => {
            let category = await categories.findOne({_id: request.params.id});
            let categoryName = category.name;
            let productsCategory = await products.find({category: categoryName}).toArray();
            
            return productsCategory;   
        }
    )}