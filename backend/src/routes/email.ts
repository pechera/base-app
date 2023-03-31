import { Router, Request, Response } from 'express';

const router: Router = Router();

// DATABASE SCHEMAS
import User from '../models/User.model.js';

router.post('/mail', async (req, res) => {
    // email
    const { link }: { link: string } = req.body;

    try {
        const user = await User.findOne({ activation_link: link });

        if (!user) {
            return res.status(500).json({ error: 'Wrong activation link' });
        }

        if (user.activated) {
            return res.status(500).json({ error: 'Email already activated' });
        }

        user.activated = true;
        // user.activation_link = null;

        await user.save();

        return res.status(200).json({ message: 'Email activated' });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

export default router;
