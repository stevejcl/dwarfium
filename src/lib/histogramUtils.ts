// Assuming this is the updated version of calculateHistogram function in histogramUtils.ts
import { fabric } from "fabric";

export const calculateHistogram = (
  imageElement: HTMLImageElement | HTMLCanvasElement
): number[][] => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2D context for canvas.");
    return [[], [], []];
  }

  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Initialize histogram arrays for RGB channels
  const histogram = [[], [], []];

  // Iterate through every pixel
  for (let i = 0; i < data.length; i += 4) {
    // Red channel value
    const red = data[i];
    // Green channel value
    const green = data[i + 1];
    // Blue channel value
    const blue = data[i + 2];

    // Increment the respective histogram bin
    histogram[0][red] = (histogram[0][red] || 0) + 1; // Red channel
    histogram[1][green] = (histogram[1][green] || 0) + 1; // Green channel
    histogram[2][blue] = (histogram[2][blue] || 0) + 1; // Blue channel
  }

  // Normalize histogram values to a percentage
  const totalPixels = imageData.width * imageData.height;
  for (let channel = 0; channel < 3; channel++) {
    const channelHistogram = histogram[channel];
    for (let i = 0; i < 256; i++) {
      channelHistogram[i] = (channelHistogram[i] || 0) / totalPixels;
    }
  }

  return histogram;
};
