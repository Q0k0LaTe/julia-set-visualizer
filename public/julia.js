document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('juliaCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  let imageData = ctx.createImageData(width, height);
  let data = imageData.data;
  
  let cReal = -0.7;
  let cImag = 0.27;
  let maxIterations = 256;
  let zoomLevel = 1.0;
  let isCalculating = false;
  
  const realSlider = document.getElementById('realPart');
  const imagSlider = document.getElementById('imagPart');
  const iterSlider = document.getElementById('maxIterations');
  const zoomSlider = document.getElementById('zoomLevel');
  const realValue = document.getElementById('realValue');
  const imagValue = document.getElementById('imagValue');
  const iterValue = document.getElementById('iterValue');
  const zoomValue = document.getElementById('zoomValue');
  const currentC = document.getElementById('currentC');
  const preset1 = document.getElementById('preset1');
  const preset2 = document.getElementById('preset2');
  const preset3 = document.getElementById('preset3');
  const preset4 = document.getElementById('preset4');
  const downloadBtn = document.getElementById('download');
  
  function showLoading() {
    loadingOverlay.style.display = 'flex';
  }
  
  function hideLoading() {
    loadingOverlay.style.display = 'none';
  }
  
  function updateComplexDisplay() {
    const realStr = cReal >= 0 ? cReal.toFixed(3) : cReal.toFixed(3);
    const imagStr = cImag >= 0 ? `+ ${cImag.toFixed(3)}i` : `- ${Math.abs(cImag).toFixed(3)}i`;
    currentC.textContent = `${realStr} ${imagStr}`;
  }
  
  function getAcademicColor(iterations, maxIterations, zx, zy) {
    let normalized;
    
    if (iterations === maxIterations) {
      // For points in the Julia set, use rich variations based on final position
      const angle = Math.atan2(zy, zx);
      const radius = Math.sqrt(zx * zx + zy * zy);
      normalized = (Math.sin(angle * 4) * 0.5 + 0.5) * 0.4 + 0.1;
    } else {
      // Smooth coloring for escaped points with enhanced smoothing
      const smoothed = iterations + 1 - Math.log(Math.log(Math.abs(zx * zx + zy * zy))) / Math.log(2);
      normalized = Math.pow(smoothed / maxIterations, 0.8); // Power scaling for better distribution
    }
    
    // Enhanced academic color scheme with richer colors
    let r, g, b;
    
    if (normalized < 0.12) {
      // Rich midnight blue to royal blue
      const t = normalized * 8.33;
      r = Math.floor(10 + t * 35);
      g = Math.floor(15 + t * 50);
      b = Math.floor(60 + t * 95);
    } else if (normalized < 0.25) {
      // Royal blue to vibrant cyan
      const t = (normalized - 0.12) * 7.69;
      r = Math.floor(45 + t * 20);
      g = Math.floor(65 + t * 120);
      b = Math.floor(155 + t * 80);
    } else if (normalized < 0.4) {
      // Cyan to emerald green
      const t = (normalized - 0.25) * 6.67;
      r = Math.floor(65 - t * 35);
      g = Math.floor(185 + t * 50);
      b = Math.floor(235 - t * 135);
    } else if (normalized < 0.55) {
      // Emerald to forest green
      const t = (normalized - 0.4) * 6.67;
      r = Math.floor(30 + t * 40);
      g = Math.floor(235 - t * 85);
      b = Math.floor(100 - t * 50);
    } else if (normalized < 0.7) {
      // Forest green to warm orange
      const t = (normalized - 0.55) * 6.67;
      r = Math.floor(70 + t * 185);
      g = Math.floor(150 + t * 80);
      b = Math.floor(50 + t * 30);
    } else if (normalized < 0.85) {
      // Orange to deep magenta
      const t = (normalized - 0.7) * 6.67;
      r = Math.floor(255 - t * 75);
      g = Math.floor(230 - t * 150);
      b = Math.floor(80 + t * 120);
    } else {
      // Deep magenta to bright violet
      const t = (normalized - 0.85) * 6.67;
      r = Math.floor(180 + t * 55);
      g = Math.floor(80 + t * 100);
      b = Math.floor(200 + t * 55);
    }
    
    // Add subtle shimmer effect for more dynamic appearance
    const shimmer = Math.sin(normalized * Math.PI * 6) * 0.15 + 1;
    r = Math.min(255, Math.floor(r * shimmer));
    g = Math.min(255, Math.floor(g * shimmer));
    b = Math.min(255, Math.floor(b * shimmer));
    
    // Ensure values are within bounds
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    
    return [r, g, b];
  }
  
  function calculateJulia() {
    if (isCalculating) return;
    isCalculating = true;
    showLoading();
    
    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      const scale = 4 / (zoomLevel * Math.min(width, height));
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let zx = scale * (x - width / 2);
          let zy = scale * (y - height / 2);
          
          let iterations = 0;
          let lastZx = zx;
          let lastZy = zy;
          
          // Iterate the quadratic polynomial f(z) = z² + c
          while (zx * zx + zy * zy < 4 && iterations < maxIterations) {
            const xtemp = zx * zx - zy * zy + cReal;
            zy = 2 * zx * zy + cImag;
            zx = xtemp;
            
            iterations++;
            
            // Store final values for smooth coloring
            if (iterations === maxIterations - 1) {
              lastZx = zx;
              lastZy = zy;
            }
          }
          
          const [r, g, b] = getAcademicColor(iterations, maxIterations, lastZx, lastZy);
          const pos = (y * width + x) * 4;
          
          data[pos] = r;
          data[pos + 1] = g;  
          data[pos + 2] = b;
          data[pos + 3] = 255;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      hideLoading();
      isCalculating = false;
    });
  }
  
  function updateJulia() {
    cReal = parseFloat(realSlider.value);
    cImag = parseFloat(imagSlider.value);
    maxIterations = parseInt(iterSlider.value);
    zoomLevel = parseFloat(zoomSlider.value);
    
    realValue.textContent = cReal.toFixed(3);
    imagValue.textContent = cImag.toFixed(3);
    iterValue.textContent = maxIterations;
    zoomValue.textContent = zoomLevel.toFixed(2) + '×';
    
    updateComplexDisplay();
    calculateJulia();
  }
  
  // Debounce function for performance optimization
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  const debouncedUpdate = debounce(updateJulia, 150);
  
  // Event listeners for parameter controls
  realSlider.addEventListener('input', debouncedUpdate);
  imagSlider.addEventListener('input', debouncedUpdate);
  iterSlider.addEventListener('input', debouncedUpdate);
  zoomSlider.addEventListener('input', debouncedUpdate);
  
  // Academic preset configurations based on notable Julia sets
  preset1.addEventListener('click', () => {
    // Basilica Julia Set (classic connected fractal)
    realSlider.value = -0.75;
    imagSlider.value = 0.0;
    iterSlider.value = 300;
    zoomSlider.value = 1.0;
    updateJulia();
  });
  
  preset2.addEventListener('click', () => {
    // Dendrite structure (interesting branching pattern)
    realSlider.value = -0.235;
    imagSlider.value = 0.827;
    iterSlider.value = 400;
    zoomSlider.value = 1.2;
    updateJulia();
  });
  
  preset3.addEventListener('click', () => {
    // Near Siegel disk parameter
    realSlider.value = -0.391;
    imagSlider.value = -0.587;
    iterSlider.value = 500;
    zoomSlider.value = 1.5;
    updateJulia();
  });
  
  preset4.addEventListener('click', () => {
    // Parabolic fixed point case
    realSlider.value = -0.8;
    imagSlider.value = 0.156;
    iterSlider.value = 350;
    zoomSlider.value = 1.3;
    updateJulia();
  });
  
  // High-resolution export functionality
  downloadBtn.addEventListener('click', () => {
    // Create high-resolution version for academic use
    const highResCanvas = document.createElement('canvas');
    const highResCtx = highResCanvas.getContext('2d');
    const resolution = 1200; // Higher resolution for publications
    
    highResCanvas.width = resolution;
    highResCanvas.height = resolution;
    
    const highResImageData = highResCtx.createImageData(resolution, resolution);
    const highResData = highResImageData.data;
    
    const scale = 4 / (zoomLevel * Math.min(resolution, resolution));
    
    // Calculate high-resolution fractal
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        let zx = scale * (x - resolution / 2);
        let zy = scale * (y - resolution / 2);
        
        let iterations = 0;
        let lastZx = zx;
        let lastZy = zy;
        
        while (zx * zx + zy * zy < 4 && iterations < maxIterations) {
          const xtemp = zx * zx - zy * zy + cReal;
          zy = 2 * zx * zy + cImag;
          zx = xtemp;
          iterations++;
          
          if (iterations === maxIterations - 1) {
            lastZx = zx;
            lastZy = zy;
          }
        }
        
        const [r, g, b] = getAcademicColor(iterations, maxIterations, lastZx, lastZy);
        const pos = (y * resolution + x) * 4;
        
        highResData[pos] = r;
        highResData[pos + 1] = g;
        highResData[pos + 2] = b;
        highResData[pos + 3] = 255;
      }
    }
    
    highResCtx.putImageData(highResImageData, 0, 0);
    
    // Generate filename with mathematical notation
    const timestamp = new Date().toISOString().slice(0, 10);
    const realStr = cReal.toFixed(3).replace('.', '_').replace('-', 'neg');
    const imagStr = cImag.toFixed(3).replace('.', '_').replace('-', 'neg');
    const filename = `julia_set_c_${realStr}_${imagStr}i_${timestamp}.png`;
    
    // Download high-resolution image
    const link = document.createElement('a');
    link.download = filename;
    link.href = highResCanvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  
  // Initialize with default parameters
  updateComplexDisplay();
  calculateJulia();
});