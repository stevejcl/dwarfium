import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { fabric } from 'fabric';
import { loadFITS } from '@/lib/fitsUtils'; // Ensure correct path
import { calculateHistogram } from '@/lib/histogramUtils'; // Ensure correct path

const ImageEditor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(0);
  const [histogram, setHistogram] = useState<number[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [imageObject, setImageObject] = useState<fabric.Image | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasInstance = new fabric.Canvas(canvasRef.current, {
        selection: false // Disable selection highlighting
      });
      setCanvas(canvasInstance);
      canvasInstance.on('mouse:down', handleMouseDown);
      canvasInstance.on('mouse:move', handleMouseMove);
      canvasInstance.on('mouse:up', handleMouseUp);
    }
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    if (file.type === 'image/fits' || file.name.endsWith('.fits')) {
      reader.onload = async (event) => {
        const buffer = event.target?.result;
        if (buffer) {
          // Use the utility function to load and process the FITS file
          const imageData = await loadFITS(buffer as ArrayBuffer);
          if (imageData) {
            renderFitsImage(imageData);
          }
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
              canvas.add(fabricImg);
              canvas.renderAll();
              setImageObject(fabricImg);
              updateHistogram(img);
              fitImageToScreen(); // Ensure image fits screen on load
            }
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderFitsImage = (data: number[][] | Float32Array | Int16Array) => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (!ctx) return;

      const width = Math.sqrt(data.length); // Assuming square image data
      const height = width;
      const imageData = ctx.createImageData(width, height);

      const stretchedData = stretchLinear(data);

      for (let i = 0; i < stretchedData.length; i++) {
        const pixelValue = stretchedData[i];
        imageData.data[4 * i] = pixelValue;     // Red
        imageData.data[4 * i + 1] = pixelValue; // Green
        imageData.data[4 * i + 2] = pixelValue; // Blue
        imageData.data[4 * i + 3] = 255;        // Alpha
      }

      ctx.putImageData(imageData, 0, 0);

      if (canvas) {
        const fabricImg = new fabric.Image(canvasElement);
        canvas.clear();
        canvas.add(fabricImg);
        canvas.renderAll();
        setImageObject(fabricImg);
        updateHistogram(canvasElement);
        fitImageToScreen(); // Ensure image fits screen on load
      }
    }
  };

  const stretchLinear = (data: number[][] | Float32Array | Int16Array): Uint8Array => {
    const flatData = Array.isArray(data) ? data.flat() : Array.from(data);
    const min = Math.min(...flatData);
    const max = Math.max(...flatData);
    const range = max - min;

    return new Uint8Array(flatData.map(value => {
      return ((value - min) / range) * 255;
    }));
  };

  const fitImageToScreen = () => {
    if (imageObject && canvas) {
      const scaleFactor = Math.min(
        canvas.width / imageObject.width!,
        canvas.height / imageObject.height!
      );
      imageObject.scale(scaleFactor);
      canvas.centerObject(imageObject);
      canvas.renderAll();
    }
  };

  const handleMouseDown = (event: fabric.IEvent) => {
    if (event.target) {
      const target = event.target as fabric.Object;
      if (target.type === 'image') {
        target.set('selectable', true);
      }
    }
  };

  const handleMouseMove = () => {
    // Handle panning here if needed
  };

  const handleMouseUp = (event: fabric.IEvent) => {
    if (event.target) {
      const target = event.target as fabric.Object;
      if (target.type === 'image') {
        target.set('selectable', false);
      }
    }
  };

  useEffect(() => {
    applyFilters();
  }, [hue, saturation, brightness]);

  const applyFilters = () => {
    if (canvas) {
      canvas.getObjects().forEach(obj => {
        if (obj.type === 'image') {
          const fabricImg = obj as fabric.Image;
          fabricImg.filters = [
            new fabric.Image.filters.HueRotation({ rotation: hue }),
            new fabric.Image.filters.Saturation({ saturation }),
            new fabric.Image.filters.Brightness({ brightness })
          ];
          fabricImg.applyFilters();
        }
      });
      canvas.renderAll();
    }
  };

  const updateHistogram = (image: HTMLImageElement | HTMLCanvasElement) => {
    const histogramData = calculateHistogram(image);
    setHistogram(histogramData);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif'],
      'image/fits': ['.fits']
    }
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
            <input type="range" min="-1" max="1" step="0.01" value={hue} onChange={(e) => setHue(parseFloat(e.target.value))} />
          </label>
          <label>
            Saturation:
            <input type="range" min="-1" max="1" step="0.01" value={saturation} onChange={(e) => setSaturation(parseFloat(e.target.value))} />
          </label>
          <label>
            Brightness:
            <input type="range" min="-1" max="1" step="0.01" value={brightness} onChange={(e) => setBrightness(parseFloat(e.target.value))} />
          </label>
        </div>
        <div className="histogram">
          <h3>Histogram</h3>
          <div className="histogram-container">
            {histogram.map((channel, index) => (
              <div key={index} className={`histogram-channel histogram-channel-${index}`}>
                {channel.map((value, bin) => (
                  <div key={bin} style={{ height: `${value}%` }} className="histogram-bar"></div>
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
