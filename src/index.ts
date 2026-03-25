import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    return res.send('Server is running 🚀')
});



app.listen(PORT, () => {
    console.log('Server on port ', + PORT);
}); 