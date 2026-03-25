import express from 'express';
import type { Request, Response } from 'express';
import { LimitterMiddleware } from './middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req: Request, __: Response, next) => {
    console.log(`method: ${req.method}`);
    next();
});


app.get('/', (_: Request, res: Response) => {
    return res.send('Server is running 🚀')
});

app.get('/limitter', LimitterMiddleware, (req: Request, res: Response) => {
    return res.send('Limitter Middleware executed successfully');
});

app.listen(PORT, () => {
    console.log('Server on port ', + PORT);
}); 