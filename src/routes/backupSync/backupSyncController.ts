import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

// Use Render's persistent storage path
const BACKUP_DIR = '/opt/render/project/src/data/backups';

export class BackupSyncController {
  constructor() {
    // Ensure backup directory exists
    fs.mkdir(BACKUP_DIR, { recursive: true }).catch(console.error);
  }

  createBackup = async (req: Request, res: Response) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.json`;
      const filePath = path.join(BACKUP_DIR, filename);

      await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));

      res.json({
        success: true,
        filename,
        timestamp,
        message: 'Backup created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create backup'
      });
    }
  };

  getLatestBackup = async (_req: Request, res: Response) => {
    try {
      const files = await fs.readdir(BACKUP_DIR);
      const backupFiles = files.filter(f => f.startsWith('backup-'));

      if (backupFiles.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No backups found'
        });
      }

      const latestFile = backupFiles.sort().pop()!;
      const data = await fs.readFile(
        path.join(BACKUP_DIR, latestFile),
        'utf8'
      );

      res.json({
        success: true,
        data: JSON.parse(data),
        filename: latestFile
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve backup'
      });
    }
  };

  listBackups = async (_req: Request, res: Response) => {
    try {
      const files = await fs.readdir(BACKUP_DIR);
      const backups = files
        .filter(f => f.startsWith('backup-'))
        .sort()
        .reverse();

      res.json({
        success: true,
        backups
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to list backups'
      });
    }
  };
}

