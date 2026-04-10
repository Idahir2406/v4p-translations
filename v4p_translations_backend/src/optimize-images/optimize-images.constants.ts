/** Tamaño máximo por archivo (5MB). */
export const MAX_IMAGE_FILE_BYTES = 5 * 1024 * 1024;

/** Límite razonable de archivos por petición. */
export const MAX_FILES_PER_REQUEST = 20;

/**
 * WebP: prioridad a peso bajo manteniendo dimensiones originales.
 * Calidad algo más baja + máximo esfuerzo de compresión del codificador.
 */
export const WEBP_QUALITY = 72;
export const WEBP_EFFORT = 6;
/** Transparencias: algo por debajo de 100 reduce tamaño en PNG/WebP con alpha. */
export const WEBP_ALPHA_QUALITY = 85;
