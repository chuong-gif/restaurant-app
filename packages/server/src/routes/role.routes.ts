import { Router } from 'express';
import {
    handleGetRoles,
    handleGetRoleById,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    handleAssignPermissions
} from '../controllers/role.controller';

const router = Router();

// CRUD cho Roles
router.get('/', handleGetRoles);
router.get('/:id', handleGetRoleById);
router.post('/', handleCreateRole);
router.put('/:id', handleUpdateRole);
router.patch('/:id', handleUpdateRole);
router.delete('/:id', handleDeleteRole);

// Route đặc biệt để gán quyền cho vai trò
router.post('/:id/permissions', handleAssignPermissions);

export default router;
