import { Router } from 'express';
import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export default function ai() {
    const router = Router();

    router
        .post('/', async (req, res, next) => {
            const body = req.body;

            if (!body.prompt) {
                return next({
                    status: 400,
                    message: 'Prompt needed to continue',
                });
            }

            try {
                const completion = await openai.images.generate({
                    model: 'dall-e-3',
                    prompt: body.prompt,
                    n: 1,
                    quality: 'standard',
                    size: '1024x1024',
                    response_format: 'url',
                });

                res.json(completion.data);
            } catch (e) {
                return next({
                    status: 500,
                    message: (e as any).data,
                });
            }
        });

    return router;
}