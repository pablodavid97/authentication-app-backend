import { get, replace, remove } from '../../../data-access/event';
import {
    isValidText,
    isValidDate,
    isValidImageUrl,
} from '../../../util/validation';

export default async function handler(req, res) {
    const method = req.method;
    const { id } = req.query;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (method === 'OPTIONS') {
        return res.status(200).end(); // Handle preflight request
    }

    try {
        if (method === 'GET') {
            const event = await get(id);
            return res.json({ event });
        } else if (method === 'PATCH') {
            const data = req.body;
            const errors = validateEventData(data);

            if (Object.keys(errors).length > 0) {
                return res.status(422).json({
                    message:
                        'Updating the event failed due to validation errors.',
                    errors,
                });
            }

            await replace(id, data);
            return res.json({ message: 'Event updated.', event: data });
        } else if (method === 'DELETE') {
            await remove(id);
            return res.json({ message: 'Event deleted.' });
        } else {
            return res.status(405).json({ message: 'Method not allowed.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
}

function validateEventData(data) {
    const errors = {};
    if (!isValidText(data.title)) errors.title = 'Invalid title.';
    if (!isValidText(data.description))
        errors.description = 'Invalid description.';
    if (!isValidDate(data.date)) errors.date = 'Invalid date.';
    if (!isValidImageUrl(data.image)) errors.image = 'Invalid image.';
    return errors;
}
