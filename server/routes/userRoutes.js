// routes/userRoutes.js
import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/', getUsers);
router.post('/createUser', createUser);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

export default router;
