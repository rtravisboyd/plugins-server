import express from 'express';
import { BackupSyncController } from './backupSyncController';

const router = express.Router();
const backupSyncController = new BackupSyncController();

router.post('/', backupSyncController.createBackup);
router.get('/latest', backupSyncController.getLatestBackup);
router.get('/list', backupSyncController.listBackups);

export const backupSyncRouter = router;

