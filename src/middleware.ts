import fs from 'node:fs';
import path from 'node:path';

import type { Request, Response, NextFunction } from 'express';

const CAPACITY = 5;
const REFILL_RATE = 1;
type Data = { [ip: string]: { tokens: number; timestamp: number } }

const getData = () => {
    try {
        const filePath = path.join(__dirname, 'data.json');
        const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Failed to read data');
    }
}

const saveData = (data: Data) => {
    try {
        const filePath = path.join(__dirname, 'data.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
        console.log('Data saved successfully');
    } catch (error) {
        throw new Error('Failed to save data');
    }
}

const refill = (data: Data, ip: string) => {

    const currentTime = Date.now();
    const timePassed = currentTime - data[ip].timestamp;

    const tokensGenerated = timePassed * (REFILL_RATE / 1000);
    const newTokens = Math.min(CAPACITY, data[ip].tokens + tokensGenerated);

    return {
        ...data[ip],
        tokens: newTokens,
        timestamp: currentTime
    }
}

export const LimitterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const ip = req.ip!;
    console.log('IP address:', ip);

    try {
        const data = getData();

        if (Object.keys(data).length === 0) {
            console.log('No data found');
            const newData = {
                [ip]: {
                    tokens: CAPACITY,
                    timestamp: Date.now()
                }
            }
            saveData(newData);
            return next();
        }

        if (ip in data) {

            data[ip] = refill(data, ip);
            const newData = { ...data };

            console.log('New data for IP:', newData);
            saveData(newData);

            next();

        }

    } catch (error: any) {
        console.error('Error in LimitterMiddleware:', error?.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}