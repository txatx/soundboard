import Dexie from "dexie";

const db = new Dexie("SoundboardDB");
const WORKDIR_KEY = "workingDirectory";
const SOUNDS = "sounds";

db.version(1).stores({
  settings: "key"
});

export async function getIsWorkingDirectorySet() {
  const workDir = await db.settings.get(WORKDIR_KEY);
  return !!workDir;
}

export async function getIsPermissionGranted() {
  const workDir = await db.settings.get(WORKDIR_KEY);

  if (workDir) {
    const permission = await workDir.handle.requestPermission({ mode: "readwrite" });
    return permission === "granted";
  } else {
    return false;
  }
}

export async function getWorkingDirectory() {
  const workDir = await db.settings.get(WORKDIR_KEY);

  if (workDir) {
    const permission = await workDir.handle.requestPermission({ mode: "readwrite" });

    if (permission === "granted") {
      return workDir.handle;
    } else {
      return null;
    }
  } else {
    setWorkingDirectory();
  }
}

export async function setWorkingDirectory() {
  const dirHandle = await window.showDirectoryPicker();
  await db.settings.put({
    key: WORKDIR_KEY,
    handle: dirHandle
  });
  await dirHandle.requestPermission({ mode: "readwrite" });

  window.location.reload();
}

export async function getStoredSounds() {
  return await db.settings.get(SOUNDS) || [];
}

export async function setStoredSounds(sounds) {
  await db.settings.put({
    key: SOUNDS,
    sounds
  });
}

export async function setStoredSoundProperty(soundId, property, value) {
  const { sounds: storedSounds } = await getStoredSounds();
  const soundIndex = storedSounds.findIndex(sound => sound.id === soundId);

  if (soundIndex !== -1) {
    storedSounds[soundIndex][property] = value;
    await setStoredSounds(storedSounds);
  }
}
