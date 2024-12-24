import { add, get } from '../../data-access/user';
import { createJSONToken } from '../../util/auth';
import { isValidEmail, isValidText } from '../../util/validation';

export default async function handler(req, res) {
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (method === 'OPTIONS') {
        return res.status(200).end(); // Handle preflight request
    }

    if (method === 'POST') {
        const data = req.body;
        let errors = {};

        if (!isValidEmail(data.email)) {
            errors.email = 'Invalid email.';
        } else {
            try {
                const existingUser = await get(data.email);
                if (existingUser) {
                    errors.email = 'Email exists already.';
                }
            } catch (error) {
                // No existing user found (normal for signup)
            }
        }

        if (!isValidText(data.password, 6)) {
            errors.password =
                'Invalid password. Must be at least 6 characters long.';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                message: 'User signup failed due to validation errors.',
                errors,
            });
        }

        try {
            const createdUser = await add(data);
            const authToken = createJSONToken(createdUser.email);
            return res.status(201).json({
                message: 'User created.',
                user: createdUser,
                token: authToken,
            });
        } catch (error) {
            return res.status(500).json({ message: 'Server error.' });
        }
    }

    res.status(405).json({ message: 'Method not allowed.' });
}
