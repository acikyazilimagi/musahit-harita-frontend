export async function compressImage(
  imageFile: File,
  maxWidthOrHeight: number,
  quality = 1
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;

      let resizeFactor: number;
      if (originalWidth / originalHeight >= 1) {
        resizeFactor = maxWidthOrHeight / originalWidth;
      } else {
        resizeFactor = maxWidthOrHeight / originalHeight;
      }

      const newWidth = originalWidth * resizeFactor;
      const newHeight = originalHeight * resizeFactor;

      canvas.width = newWidth;
      canvas.height = newHeight;

      context!.drawImage(img, 0, 0, newWidth, newHeight);

      const base64 = canvas.toDataURL("image/jpeg", quality);
      resolve(base64);
    };

    img.onerror = reject;

    img.src = URL.createObjectURL(imageFile);
  });
}
