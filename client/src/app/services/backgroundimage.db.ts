import Dexie from 'dexie';

export class BackgroundBlobImage {
  constructor(
    public spriteId: string,
    public url: string,
    public hash: string,
    public data: Blob,
    public mimeType?: string,
    public tag?: string,
    public width?: string,
    public height?: string,
  ) {}
}

export class BackgroundImageDB extends Dexie {
  public images!: Dexie.Table<BackgroundBlobImage, string>;

  constructor() {
    super('BackgroundImageDB');

    this.version(1).stores({
      images: '++id, &spriteId, hash, url',
    });

    this.images.mapToClass(BackgroundBlobImage);
  }
}

export const db: BackgroundImageDB = new BackgroundImageDB();

export function deleteImageDatabase(): Promise<void> {
  return db.delete();
}

export function openBackgroundImageDatabase(): Promise<Dexie> {
  return db.open();
}

export function deleteAllBackgroundImags(): Promise<void> {
  return db.images.clear();
}

export function createBackgroundImage(
  image: BackgroundBlobImage,
): Promise<string> {
  return db.images.put(image);
}

export function readBackgroundImageByID(
  id: string,
): Promise<BackgroundBlobImage | undefined> {
  return db.images.where('spriteId').equals(id).first();
}

export function readBackgroundImagesByURL(
  url: string,
): Promise<BackgroundBlobImage[]> {
  return db.images.where('url').equals(url).toArray();
}

export function updateBackgroundImage(
  image: BackgroundBlobImage,
): Promise<string> {
  return db.images.put(image);
}

export function deleteBackgroundImage(id: string): Promise<number> {
  return db.images.where('id').equals(id).delete();
}
