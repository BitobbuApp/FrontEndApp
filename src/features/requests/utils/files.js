const IMAGE_PATTERN = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;

export const isImageFile = (file) =>
    IMAGE_PATTERN.test(file?.url || '') || IMAGE_PATTERN.test(file?.file_name || '');

/** Splits a request's attachments into images (shown in a gallery) and other documents. */
export function splitRequestFiles(files = []) {
    const list = files || [];
    return {
        images: list.filter(isImageFile),
        documents: list.filter((file) => !isImageFile(file)),
    };
}
