import { v4 as uuid } from "uuid";

import { BANK } from "app_constants";
import { getWorkingDirectory, getStoredSounds, setStoredSounds } from "utils/db";

export async function getFileList() {
  const workingDirectory = await getWorkingDirectory();
  const { sounds: storedSounds } = await getStoredSounds();

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

        let storedSound;
        for (const sound of storedSounds) {
          if (await sound.handle.isSameEntry(entry)) {
            storedSound = sound;
            break;
          }
        }

        if (storedSound) {
          fileList.push({
            ...storedSound
          });
          continue;
        } else {
          fileList.push({
            id: uuid(),
            name: entry.name,
            type: soundType,
            handle: entry
          });
        }
      }
    }
  }

  const orderedFileList = [];
  Object.values(BANK.SOUND_TYPES).forEach(type => {
    fileList
      .filter(file => file.type === type)
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => {
        if (!a.order) {
          return 1;
        }
        if (!b.order) {
          return -1;
        }
        return a.order < b.order ? -1 : 1;
      })
      .map((file, index) => {
        return {
          ...file,
          order: index + 1
        };
      })
      .forEach(file => {
        orderedFileList.push(file);
      });
  });

  await setStoredSounds(orderedFileList);

  return orderedFileList;
}
