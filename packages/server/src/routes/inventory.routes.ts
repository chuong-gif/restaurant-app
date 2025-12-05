// packages/server/src/routes/inventory.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorize as authorizePermission } from '../middlewares/authorize.middleware'; // <--- SỬA DÒNG NÀY (Đổi tên import cho khớp với code cũ)
import * as inventoryController from '../controllers/inventory.controller';

const router = Router();

// Tất cả route đều cần đăng nhập
router.use(authenticateToken);

// === NHÀ CUNG CẤP ===
router.get('/suppliers',
    authorizePermission('view_supplier'),
    inventoryController.handleGetSuppliers
);
router.post('/suppliers',
    authorizePermission('manage_supplier'),
    inventoryController.handleCreateSupplier
);
router.patch('/suppliers/:id',
    authorizePermission('manage_supplier'),
    inventoryController.handleUpdateSupplier
);
router.delete('/suppliers/:id',
    authorizePermission('manage_supplier'),
    inventoryController.handleDeleteSupplier
);

// === NGUYÊN LIỆU ===
router.get('/materials',
    authorizePermission('view_material'),
    inventoryController.handleGetMaterials
);
router.post('/materials',
    authorizePermission('manage_material'),
    inventoryController.handleCreateMaterial
);
router.patch('/materials/:id',
    authorizePermission('manage_material'),
    inventoryController.handleUpdateMaterial
);
router.delete('/materials/:id',
    authorizePermission('manage_material'),
    inventoryController.handleDeleteMaterial
);
router.post('/import',
    authorizePermission('import_inventory'), // Quyền này đã tạo ở Giai đoạn 2
    inventoryController.handleImportInventory
);

export default router;