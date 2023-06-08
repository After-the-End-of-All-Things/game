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
    public height?: string
  ) {}
}

export class ImageDB extends Dexie {
  public images!: Dexie.Table<BlobImage, string>;

  constructor() {
    super('ImageDB');
    //
    // Define tables and indexes
    //
    this.version(1).stores({
      images: '++id, name, quality, hash, url',
    });

    // Let's physically map BlobImage class to image table.
    this.images.mapToClass(BlobImage);
  }
}

export const db: ImageDB = new ImageDB();

/**ImageDB
 * Delete the entire database
 */
export function deleteImageDatabase(): Promise<void> {
  return db.delete();
}

/**
 * Open a database
 */
export function openImageDatabase(): Promise<Dexie> {
  return db.open();
}

/**
 * Read all contacts
 */
export function readAllImages(): Promise<BlobImage[]> {
  return db.images.toArray();
}

/**
 * Delete all contacts
 */
export function deleteAllImages(): Promise<void> {
  return db.images.clear();
}

/**
 * Create a contact
 *
 * Note that since the contact is guaranteed
 * to have a unique ID we are using `put`
 * to update the databse.
 */
export function createImage(image: BlobImage): Promise<string> {
  return db.images.put(image);
}

/**
 * Read an image
 */
export function readImageByID(id: string): Promise<BlobImage | undefined> {
  return db.images.get(id);
}

/**
 * Read images by quality
 */
export function readImagesByQuality(quality: string): Promise<BlobImage[]> {
  return db.images.where('quality').equals(quality).toArray();
}

/**
 * Read images by URL
 */
export function readImagesByURL(url: string): Promise<BlobImage[]> {
  return db.images.where('url').equals(url).toArray();
}

/**
 * Read images by name
 */
export function readImagesByName(name: string): Promise<BlobImage[]> {
  return db.images.where('name').equals(name).toArray();
}

/**
 * Read images by name and quality
 */
export function readImagesByNameAndQuality(
  name: string,
  quality: string
): Promise<BlobImage | undefined> {
  return db.images.get({ name: name, quality: quality });
}

/**
 * Update image
 */
export function updateImage(image: BlobImage): Promise<string> {
  return db.images.put(image);
}

/**
 * Delete image
 */
export function deleteImage(id: string): Promise<number> {
  return db.images.where('id').equals(id).delete();
}
