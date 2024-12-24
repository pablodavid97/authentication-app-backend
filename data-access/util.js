import path from 'node:path';
import fs from 'node:fs/promises';

const dataFilePath = path.join(process.cwd(), 'data', 'events.json');

export async function readData() {
    try {
        console.log('Reading data...');
        const data = await fs.readFile(dataFilePath, 'utf8');
        console.log('Data:', data);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error.message);
        throw new Error('Failed to read data');
    }
}

export async function writeData(data) {
    try {
        console.log('Writing data...');
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        console.log('Data successfully written.');
    } catch (error) {
        console.error('Error writing data:', error.message);
        throw new Error('Failed to write data');
    }
}
