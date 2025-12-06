import Dexie from "dexie";

const db = new Dexie("SoundboardDB");
const WORKDIR_KEY = "workingDirectory";

db.version(1).stores({
  settings: "key"
});

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

async function setWorkingDirectory() {
  const dirHandle = await window.showDirectoryPicker();
  await db.settings.put({
    key: WORKDIR_KEY,
    handle: dirHandle
  });
  return dirHandle;
}
