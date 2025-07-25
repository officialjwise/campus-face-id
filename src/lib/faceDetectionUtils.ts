export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawBoundingBoxOptions {
  color?: string;
  lineWidth?: number;
  confidence?: number;
  label?: string;
  showConfidence?: boolean;
  showGuidance?: boolean;
}

export const drawBoundingBox = (
  canvas: HTMLCanvasElement,
  box: BoundingBox,
  options: DrawBoundingBoxOptions = {}
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    color = '#10b981',
    lineWidth = 3,
    confidence = 1,
    label = 'Face',
    showConfidence = true,
    showGuidance = false
  } = options;

  // Set bounding box style based on confidence
  const confidenceColor = confidence > 0.7 ? '#10b981' : confidence > 0.4 ? '#f59e0b' : '#ef4444';
  ctx.strokeStyle = color || confidenceColor;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = ctx.strokeStyle;
  
  // Draw bounding box
  ctx.strokeRect(box.x, box.y, box.width, box.height);
  
  // Draw confidence label
  if (showConfidence) {
    const labelText = `${label} ${(confidence * 100).toFixed(0)}%`;
    ctx.font = '14px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(labelText).width;
    
    // Background for label
    ctx.fillRect(box.x, box.y - 25, textWidth + 10, 20);
    
    // Label text
    ctx.fillStyle = 'white';
    ctx.fillText(labelText, box.x + 5, box.y - 10);
  }
};

export const drawFaceGuidance = (
  canvas: HTMLCanvasElement,
  hasFaces: boolean = false,
  message: string = 'Position your face here'
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (!hasFaces) {
    ctx.strokeStyle = '#ef4444'; // Red
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Draw suggested face area (center third of video)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const boxWidth = canvas.width * 0.4;
    const boxHeight = canvas.height * 0.5;
    
    ctx.strokeRect(
      centerX - boxWidth / 2,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight
    );
    
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = '16px Inter, system-ui, sans-serif';
    const textWidth = ctx.measureText(message).width;
    ctx.fillText(message, centerX - textWidth / 2, centerY + boxHeight / 2 + 25);
  }
};

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

export const drawMultipleFaces = (
  canvas: HTMLCanvasElement,
  faces: Array<{ box: BoundingBox; confidence: number }>,
  options: Omit<DrawBoundingBoxOptions, 'confidence'> = {}
) => {
  clearCanvas(canvas);
  
  faces.forEach((face, index) => {
    drawBoundingBox(canvas, face.box, {
      ...options,
      confidence: face.confidence,
      label: `Face ${index + 1}`,
    });
  });

  // Draw guidance if no faces detected
  if (faces.length === 0) {
    drawFaceGuidance(canvas, false);
  }
};
