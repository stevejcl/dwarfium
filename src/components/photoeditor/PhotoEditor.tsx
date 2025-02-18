import React, { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

interface PhotoEditorProps {
  fullImageUrl: string;
  thumbnailUrl: string;
  onClose: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({
  thumbnailUrl,
  onClose,
  fullImageUrl: initialFullImageUrl,
}) => {
  const [fullImageUrl, setFullImageUrl] = useState(initialFullImageUrl);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [temperature, setTemperature] = useState(0);
  const [filter, setFilter] = useState("");
  const [copyrightText, setCopyrightText] = useState(" \u00A9 2025 Jouw Naam");
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState(fullImageUrl);

  /**  AI Denoise functie */
  const denoiseWithAI = async () => {
    if (!imageRef.current) return;

    // Laad AI-model
    const model = await tf.loadLayersModel("/denoise/model.json");

    // Zet afbeelding om naar een canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    // Haal de afbeelding als ImageData op
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Converteer naar Tensor en preprocess
    let input = tf.browser.fromPixels(imageData, 1); // Maak grijswaarden
    input = tf.image.resizeBilinear(input, [28, 28]).toFloat();
    input = input.mean(2, true); // Grayscale
    input = input.expandDims(0).div(tf.scalar(255)); // Normaliseren

    // Laat AI-model de afbeelding bewerken
    const outputTensor = model.predict(input) as tf.Tensor;
    const outputData = outputTensor
      .squeeze()
      .mul(tf.scalar(255))
      .clipByValue(0, 255);

    // Zet het resultaat terug naar een afbeelding
    const newCanvas = document.createElement("canvas");
    newCanvas.width = imageRef.current.width;
    newCanvas.height = imageRef.current.height;
    const newCtx = newCanvas.getContext("2d");
    if (!newCtx) return;

    // Haal tensor data op
    const tensorData = await outputData.data();

    // Zet de data om naar een Uint8ClampedArray met vier kanalen (RGBA)
    const pixelArray = new Uint8ClampedArray(
      newCanvas.width * newCanvas.height * 4
    );

    // Vul het array met de juiste waarden
    for (let i = 0; i < tensorData.length; i++) {
      const grayscaleValue = tensorData[i];
      pixelArray[i * 4] = grayscaleValue; // R
      pixelArray[i * 4 + 1] = grayscaleValue; // G
      pixelArray[i * 4 + 2] = grayscaleValue; // B
      pixelArray[i * 4 + 3] = 255; // Alpha (volledig zichtbaar)
    }

    // Maak de nieuwe ImageData aan met de correcte array
    const outputImageData = new ImageData(
      pixelArray,
      newCanvas.width,
      newCanvas.height
    );
    newCtx.putImageData(outputImageData, 0, 0);

    // Sla de bewerkte afbeelding op
    const newImageUrl = newCanvas.toDataURL("image/jpeg");
    setEditedImageUrl(newImageUrl);
  };

  const applyFilter = (filterType: string) => {
    setFilter(filterType);
  };

  const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = fullImageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `${filter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${temperature}deg)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.font = "30px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.textAlign = "right";
      ctx.fillText(copyrightText, canvas.width - 20, canvas.height - 20);

      // Hier de bewerkte afbeelding opslaan
      const newImageUrl = canvas.toDataURL("image/jpeg");
      setEditedImageUrl(newImageUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const link = document.createElement("a");
            link.download = "bewerkt_foto.jpg";
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
          }
        },
        "image/jpeg",
        0.95
      );
    };
    img.onerror = () => {
      alert("Kan de afbeelding niet laden. Controleer of de URL correct is.");
    };
  };
  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setTemperature(0);
    setSharpness(100);
    setFilter(""); // Verwijder alle filters
    // Reset crop-instellingen
    // Reset crop-instellingen
    setCropStart(null);
    setCropEnd(null);
    setIsCropping(false);

    // Herstel de originele afbeelding (niet de gecropte versie)
    setEditedImageUrl(initialFullImageUrl);
    setFullImageUrl(initialFullImageUrl);
  };

  const applyCrop = () => {
    if (!cropStart || !cropEnd || !imageRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = fullImageUrl;

    img.onload = () => {
      const realWidth = img.width;
      const realHeight = img.height;

      const displayWidth = imageRef.current!.clientWidth;
      const displayHeight = imageRef.current!.clientHeight;

      const scaleX = realWidth / displayWidth;
      const scaleY = realHeight / displayHeight;

      const cropX = Math.min(cropStart.x, cropEnd.x) * scaleX;
      const cropY = Math.min(cropStart.y, cropEnd.y) * scaleY;
      const cropWidth = Math.abs(cropEnd.x - cropStart.x) * scaleX;
      const cropHeight = Math.abs(cropEnd.y - cropStart.y) * scaleY;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const newImageUrl = canvas.toDataURL("image/jpeg");

      // Zorg dat de gecropte afbeelding past binnen de bestaande container
      setEditedImageUrl(newImageUrl);
      setFullImageUrl(newImageUrl);
    };

    setCropStart(null);
    setCropEnd(null);
  };

  return (
    <div className="photo-editor-overlay">
      <div className="photo-editor-modal">
        {/* Header */}
        <div className="photo-editor-header">
          <h2>Bewerk Foto</h2>
          <button className="photo-editor-close-btn" onClick={onClose}>
            Sluiten
          </button>
        </div>

        {/* Hoofdsectie */}
        <div className="photo-editor-body">
          {/* Afbeeldingen */}
          <div className="photo-editor-content">
            <h4>Thumbnail</h4>
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="photo-editor-thumbnail"
            />

            <h4>Volledige Afbeelding</h4>
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                ref={imageRef}
                src={fullImageUrl}
                alt="Volledige Afbeelding"
                className="photo-editor-fullimage"
                style={{
                  filter: `${filter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${temperature}deg) drop-shadow(0px 0px ${
                    sharpness / 10
                  }px black)`,
                }}
              />

              {/* Overlay voor selectie */}
              <div
                className="crop-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                onMouseDown={(e) => {
                  setCropStart({
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY,
                  });
                  setIsCropping(true);
                }}
                onMouseMove={(e) => {
                  if (isCropping && cropStart) {
                    setCropEnd({
                      x: e.nativeEvent.offsetX,
                      y: e.nativeEvent.offsetY,
                    });
                  }
                }}
                onMouseUp={() => setIsCropping(false)}
              >
                {cropStart && cropEnd && (
                  <div
                    className="crop-selection"
                    style={{
                      position: "absolute",
                      border: "2px dashed red",
                      backgroundColor: "rgba(255, 0, 0, 0.2)",
                      left: Math.min(cropStart.x, cropEnd.x),
                      top: Math.min(cropStart.y, cropEnd.y),
                      width: Math.abs(cropEnd.x - cropStart.x),
                      height: Math.abs(cropEnd.y - cropStart.y),
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Zijpaneel voor bewerking */}
          <div className="photo-editor-sidebar">
            <h3>Foto Bewerken</h3>

            <button onClick={applyCrop} disabled={!cropStart || !cropEnd}>
              Bijsnijden
            </button>
            <button onClick={denoiseWithAI}>Ruis Verwijderen (AI)</button>
            {/* Helderheid */}
            <label>Helderheid</label>
            <input
              type="range"
              min="50"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
            />

            {/* Contrast */}
            <label>Contrast</label>
            <input
              type="range"
              min="50"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
            />
            {/* Scherpte */}
            <label>Scherpte</label>
            <input
              type="range"
              min="0"
              max="200"
              value={sharpness}
              onChange={(e) => setSharpness(parseInt(e.target.value))}
            />
            {/* Verzadiging */}
            <label>Verzadiging</label>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
            />

            {/* Kleurtemperatuur */}
            <label>Kleurtemperatuur</label>
            <input
              type="range"
              min="-50"
              max="50"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
            />

            {/* Filters */}
            <h4>Filters</h4>
            <button onClick={() => applyFilter("grayscale(100%)")}>
              Zwart-Wit
            </button>
            <button onClick={() => applyFilter("sepia(100%)")}>Sepia</button>
            <button onClick={resetAdjustments}>Reset</button>
          </div>
        </div>
        {/* Container voor copyright invoerveld en opslaan-knop */}
        <div className="photo-editor-footer-container">
          <div className="photo-editor-copyright">
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              placeholder="Voer copyright in..."
            />
          </div>

          <div className="photo-editor-footer">
            <button onClick={saveImage} className="photo-editor-save-btn">
              Opslaan
            </button>
          </div>
          <button
            onClick={() => {
              const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                editedImageUrl
              )}`;
              window.open(facebookShareUrl, "_blank");
            }}
            className="photo-editor-share-btn"
          >
            <img src="/images/facebook-icon.svg" alt="Facebook" />
            Delen op Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
