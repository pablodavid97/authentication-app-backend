import { get } from '../../data-access/user';
import { createJSONToken, isValidPassword } from '../../util/auth';

export default async function handler(req, res) {
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (method === 'POST') {
        const { email, password } = req.body;

        let user;
        try {
            user = await get(email);
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed.' });
        }

        const pwIsValid = await isValidPassword(password, user.password);
        if (!pwIsValid) {
            return res.status(422).json({
                message: 'Invalid credentials.',
                errors: {
                    credentials: 'Invalid email or password entered.',
                },
            });
        }

        const token = createJSONToken(email);
        return res.json({ token });
    }

    res.status(405).json({ message: 'Method not allowed.' });
}
