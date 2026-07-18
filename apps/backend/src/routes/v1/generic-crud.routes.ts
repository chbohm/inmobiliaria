import { Router } from 'express';

export function createGenericCrudRouter(resource: string): Router {
    const router = Router();

    router.get('/', (_req, res) => {
        res.json({ success: true, resource, items: [] });
    });

    router.get('/:id', (req, res) => {
        res.json({ success: true, resource, id: req.params.id, item: null });
    });

    router.post('/', (req, res) => {
        res.status(201).json({ success: true, resource, payload: req.body });
    });

    router.put('/:id', (req, res) => {
        res.json({ success: true, resource, id: req.params.id, payload: req.body });
    });

    router.delete('/:id', (req, res) => {
        res.json({ success: true, resource, id: req.params.id });
    });

    return router;
}
