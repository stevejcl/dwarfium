import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { fabric } from "fabric";
import { loadFITS } from "@/lib/fitsUtils";
import { calculateHistogram } from "@/lib/histogramUtils";
import * as UTIF from "utif";

const ImageEditor: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(0);
  const [histogram, setHistogram] = useState<number[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [imageObject, setImageObject] = useState<fabric.Image | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosX, setLastPosX] = useState<number | null>(null);
  const [lastPosY, setLastPosY] = useState<number | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasInstance = new fabric.Canvas(canvasRef.current, {
        selection: false,
      });
      setCanvas(canvasInstance);
      canvasInstance.on("mouse:down", handleMouseDown);
      canvasInstance.on("mouse:move", handleMouseMove);
      canvasInstance.on("mouse:up", handleMouseUp);
      canvasInstance.on("mouse:wheel", handleMouseWheel);
    }
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    if (file.type === "image/fits" || file.name.endsWith(".fits")) {
      reader.onload = async (event) => {
        const buffer = event.target?.result;
        if (buffer) {
          const imageData = await loadFITS(buffer as ArrayBuffer);
          if (imageData) {
            renderFitsImage(imageData);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (
      file.type === "image/tiff" ||
      file.type === "image/tif" ||
      file.name.endsWith(".tiff") ||
      file.name.endsWith(".tif")
    ) {
      reader.onload = (event) => {
        const buffer = event.target?.result;
        if (buffer) {
          renderTiffImage(buffer as ArrayBuffer);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (event) => {
        const src = event.target?.result;
        if (src) {
          setImageSrc(src);
          const img = new Image();
          img.src = src as string;
          img.onload = () => {
            if (canvas) {
              canvas.clear();
              const fabricImg = new fabric.Image(img);
              setImageObject(fabricImg);
              fitImageToScreen(fabricImg);
              canvas.add(fabricImg);
              canvas.renderAll();
              updateHistogram();
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTiffImage = (buffer: ArrayBuffer) => {
    const ifds = UTIF.decode(buffer);
    const timage = ifds[0];
    UTIF.decodeImage(buffer, timage);
    const rgbaArray = new Uint8ClampedArray(UTIF.toRGBA8(timage));
    const imageData = new ImageData(rgbaArray, timage.width, timage.height);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = timage.width;
    tempCanvas.height = timage.height;

    const ctx = tempCanvas.getContext("2d");
    if (ctx) {
      ctx.putImageData(imageData, 0, 0);

      if (canvas) {
        const fabricImg = new fabric.Image(tempCanvas);
        setImageObject(fabricImg);
        fitImageToScreen(fabricImg);
        canvas.clear();
        canvas.add(fabricImg);
        canvas.renderAll();
        updateHistogram();
      }
    }
  };

  const renderFitsImage = (data: number[][] | Float32Array | Int16Array) => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const ctx = canvasElement.getContext("2d");
      if (!ctx) return;

      const width = Math.sqrt(data.length);
      const height = width;
      const imageData = ctx.createImageData(width, height);

      const stretchedData = stretchLinear(data);

      for (let i = 0; i < stretchedData.length; i++) {
        const pixelValue = stretchedData[i];
        imageData.data[4 * i] = pixelValue; // Red
        imageData.data[4 * i + 1] = pixelValue; // Green
        imageData.data[4 * i + 2] = pixelValue; // Blue
        imageData.data[4 * i + 3] = 255; // Alpha
      }

      ctx.putImageData(imageData, 0, 0);

      if (canvas) {
        const fabricImg = new fabric.Image(canvasElement);
        setImageObject(fabricImg);
        fitImageToScreen(fabricImg); // Fit image to screen on load
        canvas.clear();
        canvas.add(fabricImg);
        canvas.renderAll();
        updateHistogram();
      }
    }
  };

  const stretchLinear = (
    data: number[][] | Float32Array | Int16Array
  ): Uint8Array => {
    const flatData = Array.isArray(data) ? data.flat() : Array.from(data);
    const min = Math.min(...flatData);
    const max = Math.max(...flatData);
    const range = max - min;

    return new Uint8Array(
      flatData.map((value) => {
        return ((value - min) / range) * 255;
      })
    );
  };

  const fitImageToScreen = (fabricImg: fabric.Image) => {
    if (canvas && fabricImg) {
      const canvasWidth = canvas.width!;
      const canvasHeight = canvas.height!;
      const imgWidth = fabricImg.width!;
      const imgHeight = fabricImg.height!;

      // Calculate scale factor to fit the image within the canvas dimensions
      const scaleFactor = Math.min(
        canvasWidth / imgWidth,
        canvasHeight / imgHeight
      );

      fabricImg.scale(scaleFactor);
      canvas.centerObject(fabricImg);
      fabricImg.setCoords();
      canvas.renderAll();
    }
  };

  const handleMouseDown = (event: fabric.IEvent) => {
    if (event.target) {
      setIsDragging(true);
      setLastPosX(event.e.clientX);
      setLastPosY(event.e.clientY);
      canvas?.setCursor("move");
    }
  };

  const handleMouseMove = (event: fabric.IEvent) => {
    if (isDragging && imageObject) {
      const deltaX = event.e.clientX - (lastPosX || 0);
      const deltaY = event.e.clientY - (lastPosY || 0);

      imageObject.left! += deltaX;
      imageObject.top! += deltaY;
      setLastPosX(event.e.clientX);
      setLastPosY(event.e.clientY);
      canvas?.renderAll();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    canvas?.setCursor("default");
  };

  const handleMouseWheel = (event: fabric.IEvent) => {
    if (imageObject && canvas) {
      const delta = event.e.deltaY;
      let zoom = imageObject.scaleX || 1;
      zoom *= 1 - delta / 200;
      if (zoom > 0.1) {
        imageObject.scale(zoom);
        imageObject.setCoords();
        canvas.centerObject(imageObject);
        canvas.renderAll();
      }
    }
    event.e.preventDefault();
    event.e.stopPropagation();
  };

  useEffect(() => {
    applyFilters();
  }, [hue, saturation, brightness]);

  const applyFilters = () => {
    if (canvas) {
      canvas.getObjects().forEach((obj) => {
        if (obj.type === "image") {
          const fabricImg = obj as fabric.Image;
          fabricImg.filters = [
            new fabric.Image.filters.HueRotation({ rotation: hue }),
            new fabric.Image.filters.Saturation({ saturation }),
            new fabric.Image.filters.Brightness({ brightness }),
          ];
          fabricImg.applyFilters();
        }
      });
      canvas.renderAll();
    }
  };

  const updateHistogram = () => {
    if (!canvas || !imageObject) return;

    canvas.renderAll();

    let targetImage: HTMLImageElement | HTMLCanvasElement | null = null;

    if (imageObject.getElement() instanceof HTMLCanvasElement) {
      targetImage = imageObject.getElement() as HTMLCanvasElement;
    } else if (imageObject.getElement() instanceof HTMLImageElement) {
      targetImage = imageObject.getElement() as HTMLImageElement;
    }

    if (targetImage) {
      const histogramData = calculateHistogram(targetImage);
      setHistogram(histogramData);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/tiff": [".tiff", ".tif"],
      "image/fits": [".fits"],
    },
  });

  return (
    <div className="image-editor-container">
      <div className="sidebar">
        <div className="dropzone" {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
        <div className="controls">
          <label>
            Hue:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={hue}
              onChange={(e) => setHue(parseFloat(e.target.value))}
            />
          </label>
          <label>
            Saturation:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={saturation}
              onChange={(e) => setSaturation(parseFloat(e.target.value))}
            />
          </label>
          <label>
            Brightness:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
            />
          </label>
        </div>
        <div className="histogram">
          <h3>Histogram</h3>
          <div className="histogram-container">
            {histogram.map((channel, index) => (
              <div
                key={index}
                className={`histogram-channel histogram-channel-${index}`}
              >
                {channel.map((value, bin) => (
                  <div
                    key={bin}
                    style={{ height: `${value}%` }}
                    className="histogram-bar"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} width={800} height={600}></canvas>
      </div>
    </div>
  );
};

export default ImageEditor;
