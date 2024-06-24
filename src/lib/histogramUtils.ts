export const calculateHistogram = (
  image: HTMLImageElement | HTMLCanvasElement
): number[][] => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [[], [], []];

  const width = image.width;
  const height = image.height;

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const histogram: number[][] = [[], [], []]; // RGB channels

  for (let i = 0; i < 256; i++) {
    histogram[0][i] = 0;
    histogram[1][i] = 0;
    histogram[2][i] = 0;
  }

  for (let i = 0; i < data.length; i += 4) {
    histogram[0][data[i]]++; // Red
    histogram[1][data[i + 1]]++; // Green
    histogram[2][data[i + 2]]++; // Blue
  }

  // Normalize the histogram values to a percentage scale
  for (let channel = 0; channel < 3; channel++) {
    const max = Math.max(...histogram[channel]);
    histogram[channel] = histogram[channel].map((value) => (value / max) * 100);
  }

  return histogram;
};
