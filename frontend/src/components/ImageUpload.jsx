import React, { useRef } from "react";

// Reads an image file, downsizes it on a canvas (keeps PDF exports fast and
// keeps the Mongo document small), and returns a Base64 data URL.
function resizeImageToBase64(file, maxDim = 500) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png", 0.92));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ label, value, onChange, shape = "square" }) {
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const base64 = await resizeImageToBase64(file);
    onChange(base64);
  };

  return (
    <div>
      <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400 mb-1.5">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-16 h-16 border border-dashed border-ink-100 bg-paper text-ink-200 overflow-hidden ${
            shape === "square" ? "rounded-md" : "rounded-full"
          }`}
        >
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-contain" />
          ) : (
            <span className="text-[10px] text-center px-1">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs font-semibold px-3 py-1.5 rounded-md border border-ink-100 text-ink-700 hover:border-brass-400 hover:text-brass-700 transition"
          >
            Upload image
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-ink-400 hover:text-rust transition text-left"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
