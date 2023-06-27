import Dexie from 'dexie';

export class BlobImage {
  constructor(
    public name: string,
    public hash: string,
    public quality: string,
    public url: string,
    public data: Blob,
    public mimeType?: string,
    public tag?: string,
    public width?: string,
    public height?: string,
  ) {}
}

export class ImageDB extends Dexie {
  public images!: Dexie.Table<BlobImage, string>;

  constructor() {
    super('ImageDB');

    this.version(1).stores({
      images: '++id, [name+quality], hash, url',
    });

    this.images.mapToClass(BlobImage);
  }
}

export const db: ImageDB = new ImageDB();

export function deleteImageDatabase(): Promise<void> {
  return db.delete();
}

export function openImageDatabase(): Promise<Dexie> {
  return db.open();
}

export function readAllImages(): Promise<BlobImage[]> {
  return db.images.toArray();
}

export function deleteAllImages(): Promise<void> {
  return db.images.clear();
}

export function createImage(image: BlobImage): Promise<string> {
  return db.images.put(image);
}

export function readImageByID(id: string): Promise<BlobImage | undefined> {
  return db.images.get(id);
}

export function readImagesByQuality(quality: string): Promise<BlobImage[]> {
  return db.images.where('quality').equals(quality).toArray();
}

export function readImageByURL(url: string): Promise<BlobImage | undefined> {
  return db.images.where('url').equals(url).first();
}

export function readImagesByName(name: string): Promise<BlobImage[]> {
  return db.images.where('name').equals(name).toArray();
}

export function readImagesByNameAndQuality(
  name: string,
  quality: string,
): Promise<BlobImage | undefined> {
  return db.images.get({ name: name, quality: quality });
}

export function updateImage(image: BlobImage): Promise<string> {
  return db.images.put(image);
}

export function deleteImage(id: string): Promise<number> {
  return db.images.where('id').equals(id).delete();
}
