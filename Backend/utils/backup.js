import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import crypto from "crypto";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

const BACKUP_DIR = process.env.BACKUP_DIR || "./backups";
const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS || "7");

export const ensureBackupDir = async () => {
  try {
    await mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create backup directory:", error);
  }
};

export const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
  const metadataFile = path.join(BACKUP_DIR, `backup-${timestamp}.meta.json`);

  await ensureBackupDir();

  const collections = mongoose.connection.collections;
  const backupData: any = {};

  for (const [name, collection] of Object.entries(collections)) {
    if (name.startsWith("system.")) continue;

    try {
      const documents = await collection.find({}).toArray();
      backupData[name] = documents;
    } catch (error) {
      console.error(`Failed to backup collection ${name}:`, error);
    }
  }

  const metadata = {
    timestamp: new Date().toISOString(),
    mongooseVersion: mongoose.version,
    nodeVersion: process.version,
    collections: Object.keys(backupData),
    totalDocuments: Object.values(backupData).reduce((sum, docs) => sum + (Array.isArray(docs) ? docs.length : 0), 0),
  };

  const backupJson = JSON.stringify(backupData, null, 2);
  const checksum = crypto.createHash("sha256").update(backupJson).digest("hex");

  try {
    await writeFile(backupFile, backupJson);
    await writeFile(metadataFile, JSON.stringify({ ...metadata, checksum }, null, 2));

    console.log(`Backup created: ${backupFile}`);
    console.log(`Total documents backed up: ${metadata.totalDocuments}`);

    await cleanupOldBackups();

    return { backupFile, metadata };
  } catch (error) {
    console.error("Failed to write backup files:", error);
    throw error;
  }
};

export const restoreBackup = async (backupFile: string) => {
  if (!fs.existsSync(backupFile)) {
    throw new Error(`Backup file not found: ${backupFile}`);
  }

  const content = await readFile(backupFile, "utf-8");
  const backupData = JSON.parse(content);

  for (const [collectionName, documents] of Object.entries(backupData)) {
    if (collectionName.startsWith("system.")) continue;

    try {
      const collection = mongoose.connection.collection(collectionName);
      if (Array.isArray(documents) && documents.length > 0) {
        await collection.deleteMany({});
        await collection.insertMany(documents);
        console.log(`Restored ${documents.length} documents to ${collectionName}`);
      }
    } catch (error) {
      console.error(`Failed to restore collection ${collectionName}:`, error);
    }
  }

  return { restored: true, collections: Object.keys(backupData) };
};

export const listBackups = async () => {
  await ensureBackupDir();

  try {
    const files = await readdir(BACKUP_DIR);
    const backups = files
      .filter((f) => f.endsWith(".meta.json"))
      .map((f) => {
        const metaPath = path.join(BACKUP_DIR, f);
        const content = fs.readFileSync(metaPath, "utf-8");
        const meta = JSON.parse(content);
        return {
          file: f.replace(".meta.json", ".json"),
          metaPath,
          ...meta,
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return backups;
  } catch (error) {
    console.error("Failed to list backups:", error);
    return [];
  }
};

export const deleteBackup = async (backupFile: string) => {
  const baseName = backupFile.replace(".meta.json", "").replace(".json", "");
  const jsonFile = path.join(BACKUP_DIR, `${baseName}.json`);
  const metaFile = path.join(BACKUP_DIR, `${baseName}.meta.json`);

  try {
    if (fs.existsSync(jsonFile)) {
      await unlink(jsonFile);
    }
    if (fs.existsSync(metaFile)) {
      await unlink(metaFile);
    }
    console.log(`Deleted backup: ${baseName}`);
    return true;
  } catch (error) {
    console.error("Failed to delete backup:", error);
    return false;
  }
};

export const cleanupOldBackups = async () => {
  const backups = await listBackups();

  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);

    for (const backup of toDelete) {
      await deleteBackup(backup.metaPath);
    }

    console.log(`Cleaned up ${toDelete.length} old backups`);
  }

  return backups.length;
};

export const verifyBackup = async (backupFile: string) => {
  try {
    const content = await readFile(backupFile, "utf-8");
    const backupData = JSON.parse(content);

    const baseName = backupFile.replace(".json", "");
    const metaFile = path.join(BACKUP_DIR, `${baseName}.meta.json`);

    if (fs.existsSync(metaFile)) {
      const metaContent = await readFile(metaFile, "utf-8");
      const meta = JSON.parse(metaContent);

      const checksum = crypto.createHash("sha256").update(content).digest("hex");

      if (checksum !== meta.checksum) {
        return { valid: false, error: "Checksum mismatch" };
      }
    }

    return {
      valid: true,
      collections: Object.keys(backupData),
      totalDocuments: Object.values(backupData).reduce(
        (sum, docs) => sum + (Array.isArray(docs) ? docs.length : 0),
        0
      ),
    };
  } catch (error) {
    return { valid: false, error: String(error) };
  }
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const runCommand = async () => {
    switch (command) {
      case "create":
        await createBackup();
        break;
      case "list":
        const backups = await listBackups();
        console.log("Available backups:", JSON.stringify(backups, null, 2));
        break;
      case "cleanup":
        await cleanupOldBackups();
        break;
      default:
        console.log("Usage: node backup.js [create|list|cleanup]");
    }
    process.exit(0);
  };

  runCommand().catch((error) => {
    console.error("Backup command failed:", error);
    process.exit(1);
  });
}
