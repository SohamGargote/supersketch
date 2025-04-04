export const shapes = {
  arrow: (x1, y1, x2, y2, ctx) => {
    const headlen = 5;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headlen * Math.cos(angle - Math.PI / 7),
      y2 - headlen * Math.sin(angle - Math.PI / 7)
    );

    ctx.lineTo(
      x2 - headlen * Math.cos(angle + Math.PI / 7),
      y2 - headlen * Math.sin(angle + Math.PI / 7)
    );

    ctx.lineTo(x2, y2);
    ctx.lineTo(
      x2 - headlen * Math.cos(angle - Math.PI / 7),
      y2 - headlen * Math.sin(angle - Math.PI / 7)
    );
  },
  line: (x1, y1, x2, y2, ctx) => {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  },
  rectangle: (x1, y1, x2, y2, ctx) => {
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
  },
  diamond: (x1, y1, x2, y2, ctx) => {
    const width = x2 - x1;
    const height = y2 - y1;
    ctx.moveTo(x1 + width / 2, y1);
    ctx.lineTo(x2, y1 + height / 2);
    ctx.lineTo(x1 + width / 2, y2);
    ctx.lineTo(x1, y1 + height / 2);
  },
  circle: (x1, y1, x2, y2, ctx) => {
    const width = x2 - x1;
    const height = y2 - y1;
    ctx.ellipse(
      x1 + width / 2,
      y1 + height / 2,
      Math.abs(width) / 2,
      Math.abs(height) / 2,
      0,
      0,
      2 * Math.PI
    );
  },
  text: (x1, y1, x2, y2, ctx) => {
    // For text elements, we don't draw a rectangle
    // The text will be drawn directly in the draw function
  },
  brush: (points, ctx, strokeWidth = 2) => {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Use quadratic curves for smoother lines
    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    
    // For the last two points, just use a line
    if (points.length >= 2) {
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }
    
    ctx.stroke();
  }
};

export function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getFocuseDemention(element, padding) {
  const { x1, y1, x2, y2 } = element;

  if (element.tool == "line" || element.tool == "arrow")
    return { fx: x1, fy: y1, fw: x2, fh: y2 };

  const p = { min: padding, max: padding * 2 };
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  return {
    fx: minX - p.min,
    fy: minY - p.min,
    fw: maxX - minX + p.max,
    fh: maxY - minY + p.max,
  };
}

export function getFocuseCorners(element, padding, position) {
  // Special handling for text elements
  if (element.tool === "text") {
    const { x1, y1, text, fontSize } = element;
    const textWidth = (text || "Text").length * (fontSize || 16) * 0.6;
    const textHeight = (fontSize || 16) * 1.2;
    
    // Create a focus area around the text
    const textMinX = x1 - 5;
    const textMaxX = x1 + textWidth + 5;
    const textMinY = y1 - 5;
    const textMaxY = y1 + textHeight + 5;
    
    return {
      line: { 
        fx: textMinX, 
        fy: textMinY, 
        fw: textMaxX - textMinX, 
        fh: textMaxY - textMinY 
      },
      corners: [
        { slug: "tl", x: textMinX - position, y: textMinY - position },
        { slug: "tr", x: textMaxX - position, y: textMinY - position },
        { slug: "bl", x: textMinX - position, y: textMaxY - position },
        { slug: "br", x: textMaxX - position, y: textMaxY - position },
        { slug: "tt", x: textMinX + (textMaxX - textMinX)/2 - position, y: textMinY - position },
        { slug: "rr", x: textMaxX - position, y: textMinY + (textMaxY - textMinY)/2 - position },
        { slug: "ll", x: textMinX - position, y: textMinY + (textMaxY - textMinY)/2 - position },
        { slug: "bb", x: textMinX + (textMaxX - textMinX)/2 - position, y: textMaxY - position }
      ]
    };
  }

  let { fx, fy, fw, fh } = getFocuseDemention(element, padding);

  if (element.tool == "line" || element.tool == "arrow") {
    return {
      line: { fx, fy, fw, fh },
      corners: [
        {
          slug: "l1",
          x: fx - position,
          y: fy - position,
        },
        {
          slug: "l2",
          x: fw - position,
          y: fh - position,
        },
      ],
    };
  }
  return {
    line: { fx, fy, fw, fh },
    corners: [
      {
        slug: "tl",
        x: fx - position,
        y: fy - position,
      },
      {
        slug: "tr",
        x: fx + fw - position,
        y: fy - position,
      },
      {
        slug: "bl",
        x: fx - position,
        y: fy + fh - position,
      },
      {
        slug: "br",
        x: fx + fw - position,
        y: fy + fh - position,
      },
      {
        slug: "tt",
        x: fx + fw / 2 - position,
        y: fy - position,
      },
      {
        slug: "rr",
        x: fx + fw - position,
        y: fy + fh / 2 - position,
      },
      {
        slug: "ll",
        x: fx - position,
        y: fy + fh / 2 - position,
      },
      {
        slug: "bb",
        x: fx + fw / 2 - position,
        y: fy + fh - position,
      },
    ],
  };
}

export function drawFocuse(element, context, padding, scale) {
  const lineWidth = 1 / scale;
  const square = 10 / scale;
  let round = square;
  const position = square / 2;

  // Special handling for text elements
  if (element.tool === "text") {
    const { x1, y1, text, fontSize } = element;
    const textWidth = (text || "Text").length * (fontSize || 16) * 0.6;
    const textHeight = (fontSize || 16) * 1.2;
    
    // Create a focus area around the text
    const textMinX = x1 - 5;
    const textMaxX = x1 + textWidth + 5;
    const textMinY = y1 - 5;
    const textMaxY = y1 + textHeight + 5;
    
    // Draw focus corners
    context.lineWidth = lineWidth;
    context.strokeStyle = "#211C6A";
    context.fillStyle = "#EEF5FF";
    
    // Draw corners at the four corners of the text area
    const corners = [
      { x: textMinX - position, y: textMinY - position, slug: "tl" },
      { x: textMaxX - position, y: textMinY - position, slug: "tr" },
      { x: textMinX - position, y: textMaxY - position, slug: "bl" },
      { x: textMaxX - position, y: textMaxY - position, slug: "br" },
      { x: textMinX + textWidth/2 - position, y: textMinY - position, slug: "tt" },
      { x: textMaxX - position, y: textMinY + textHeight/2 - position, slug: "rr" },
      { x: textMinX - position, y: textMinY + textHeight/2 - position, slug: "ll" },
      { x: textMinX + textWidth/2 - position, y: textMaxY - position, slug: "bb" }
    ];
    
    context.beginPath();
    corners.forEach((corner) => {
      context.roundRect(corner.x, corner.y, square, square, round);
    });
    context.fill();
    context.stroke();
    context.closePath();
    
    return;
  }

  let demention = getFocuseCorners(element, padding, position);
  let { fx, fy, fw, fh } = demention.line;
  let corners = demention.corners;

  context.lineWidth = lineWidth;
  context.strokeStyle = "#211C6A";
  context.fillStyle = "#EEF5FF";

  if (element.tool != "line" && element.tool != "arrow") {
    context.beginPath();
    context.rect(fx, fy, fw, fh);
    context.setLineDash([0, 0]);
    context.stroke();
    context.closePath();
    round = 3 / scale;
  }

  context.beginPath();
  corners.forEach((corner) => {
    context.roundRect(corner.x, corner.y, square, square, round);
  });
  context.fill();
  context.stroke();
  context.closePath();
}

export function draw(element, context) {
  const { tool, x1, y1, x2, y2, points = [], strokeWidth = 2 } = element;
  
  if (tool === 'brush') {
    const {
      strokeColor,
      opacity,
    } = element;
    
    context.lineWidth = strokeWidth;
    context.strokeStyle = rgba(strokeColor, opacity);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    shapes.brush(points, context, strokeWidth);
    return;
  }
  
  context.beginPath();
  const {
    strokeWidth: elementStrokeWidth,
    strokeColor,
    strokeStyle,
    fill,
    opacity,
    text,
    fontSize,
  } = element;

  context.lineWidth = elementStrokeWidth;
  context.strokeStyle = rgba(strokeColor, opacity);
  context.fillStyle = rgba(fill, opacity);

  if (strokeStyle == "dashed")
    context.setLineDash([elementStrokeWidth * 2, elementStrokeWidth * 2]);
  if (strokeStyle == "dotted") context.setLineDash([elementStrokeWidth, elementStrokeWidth]);
  if (strokeStyle == "solid") context.setLineDash([0, 0]);

  if (tool === "text") {
    // For text elements, just draw the text without a border
    context.beginPath();
    context.font = `${fontSize || 16}px Arial`;
    context.textBaseline = "top";
    context.fillStyle = rgba(strokeColor, opacity);
    context.fillText(text || "Text", x1, y1);
    context.closePath();
  } else {
    // For other shapes, draw normally
    shapes[tool](x1, y1, x2, y2, context);
    context.fill();
    context.closePath();
    if (elementStrokeWidth > 0) context.stroke();
  }
}

function rgba(color, opacity) {
  if (color == "transparent") return "transparent";

  let matches = color.match(
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
  );
  if (!matches) {
    throw new Error(
      "Invalid color format. Please provide a color in RGBA format."
    );
  }
  opacity /= 100;
  let red = parseInt(matches[1]);
  let green = parseInt(matches[2]);
  let blue = parseInt(matches[3]);
  let alpha = parseFloat(matches[4] * opacity || opacity);

  let newColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  return newColor;
}

export function inSelectedCorner(element, x, y, padding, scale) {
  padding = element.tool == "line" || element.tool == "arrow" ? 0 : padding;

  const square = 10 / scale;
  const position = square / 2;

  const corners = getFocuseCorners(element, padding, position).corners;

  const hoveredCorner = corners.find(
    (corner) =>
      x - corner.x <= square &&
      x - corner.x >= 0 &&
      y - corner.y <= square &&
      y - corner.y >= 0
  );

  return hoveredCorner;
}

export function cornerCursor(corner) {
  switch (corner) {
    case "tt":
    case "bb":
      return "s-resize";
    case "ll":
    case "rr":
      return "e-resize";
    case "tl":
    case "br":
      return "se-resize";
    case "tr":
    case "bl":
      return "ne-resize";
    case "l1":
    case "l2":
      return "pointer";
  }
}
