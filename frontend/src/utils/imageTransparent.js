/**
 * Automatically samples image corner pixels and converts cream/white background pixels to transparent PNG.
 */
export function removeImageBackground(imageSrc, tolerance = 40) {
  return new Promise((resolve) => {
    if (!imageSrc || typeof imageSrc !== 'string') {
      return resolve(imageSrc || '');
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Sample 4 corner pixels
        const cornerIndices = [
          0, // top-left
          (canvas.width - 1) * 4, // top-right
          ((canvas.height - 1) * canvas.width) * 4, // bottom-left
          ((canvas.height - 1) * canvas.width + canvas.width - 1) * 4, // bottom-right
        ];

        let bgR = 0;
        let bgG = 0;
        let bgB = 0;

        cornerIndices.forEach((idx) => {
          bgR += data[idx];
          bgG += data[idx + 1];
          bgB += data[idx + 2];
        });

        bgR = Math.round(bgR / 4);
        bgG = Math.round(bgG / 4);
        bgB = Math.round(bgB / 4);

        // Check background brightness (luminance)
        const bgLuma = 0.299 * bgR + 0.587 * bgG + 0.114 * bgB;

        // Only process if the background is light (white, cream, beige, light gray)
        if (bgLuma > 170) {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const diff = Math.sqrt(
              (r - bgR) ** 2 +
              (g - bgG) ** 2 +
              (b - bgB) ** 2
            );

            const pixelLuma = 0.299 * r + 0.587 * g + 0.114 * b;

            if (diff < tolerance || (pixelLuma > 235 && diff < tolerance * 1.5)) {
              if (diff < tolerance * 0.6) {
                data[i + 3] = 0; // Fully transparent
              } else {
                const alphaFactor = (diff - tolerance * 0.6) / (tolerance * 0.4);
                data[i + 3] = Math.round(255 * alphaFactor);
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
          return;
        }

        resolve(imageSrc);
      } catch {
        resolve(imageSrc);
      }
    };

    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}
