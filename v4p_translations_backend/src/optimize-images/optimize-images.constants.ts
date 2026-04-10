/** Tamaño máximo por archivo (5MB). */
export const MAX_IMAGE_FILE_BYTES = 5 * 1024 * 1024;

/** Límite razonable de archivos por petición. */
export const MAX_FILES_PER_REQUEST = 20;

/**
 * Encaje tipo "Full HD": la imagen cabe dentro de 1920×1080 sin ampliar
 * imágenes más pequeñas (equilibrio calidad / peso).
 */
export const RESIZE_MAX_WIDTH = 1920;
export const RESIZE_MAX_HEIGHT = 1080;

/** WebP: buen equilibrio entre nitidez y compresión. */
export const WEBP_QUALITY = 82;
export const WEBP_EFFORT = 6;
