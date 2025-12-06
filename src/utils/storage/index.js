import { v4 as uuid } from "uuid";

import { BANK } from "app_constants";
import { getWorkingDirectory } from "utils/db";

export async function getFileList() {
  const workingDirectory = await getWorkingDirectory();

  const workingDirectoryEntries = await workingDirectory.values();

  const availableSubDirectories = [];
  for await (const entry of workingDirectoryEntries) {
    if (entry.kind === "directory") {
      availableSubDirectories.push(entry);
    }
  }

  const fileList = [];

  for await (const subDir of availableSubDirectories) {
    const subDirectoryHandle = await workingDirectory.getDirectoryHandle(subDir.name);
    const subDirectoryEntries = await subDirectoryHandle.values();

    for await (const entry of subDirectoryEntries) {
      if (entry.kind === "file") {
        const soundType =
          Object.values(BANK.SOUND_TYPES).find(type => type.toLowerCase() === subDir.name.toLowerCase()) || "Unknown";

        fileList.push({
          id: uuid(),
          name: entry.name,
          type: soundType,
          handle: entry
        });
      }
    }
  }

  return fileList;
}
