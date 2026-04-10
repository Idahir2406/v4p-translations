export type OptimizedImageResult = {
  originalName: string;
  /** Nombre sugerido para guardar (siempre .webp). */
  filename: string;
  mimeType: 'image/webp';
  /** Bytes del WebP optimizado. */
  size: number;
  /** Contenido WebP en base64 para JSON. */
  dataBase64: string;
};
