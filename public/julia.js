document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('juliaCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let imageData = ctx.createImageData(width, height);
    let data = imageData.data;
    
    let cReal = -0.7;
    let cImag = 0.27;
    let maxIterations = 100;
    let zoomLevel = 1.0;
    
    const realSlider = document.getElementById('realPart');
    const imagSlider = document.getElementById('imagPart');
    const iterSlider = document.getElementById('maxIterations');
    const zoomSlider = document.getElementById('zoomLevel');
    const realValue = document.getElementById('realValue');
    const imagValue = document.getElementById('imagValue');
    const iterValue = document.getElementById('iterValue');
    const zoomValue = document.getElementById('zoomValue');
    const preset1 = document.getElementById('preset1');
    const preset2 = document.getElementById('preset2');
    const preset3 = document.getElementById('preset3');
    const preset4 = document.getElementById('preset4');
    const downloadBtn = document.getElementById('download');
    
    function getColor(iterations, maxIterations, zx, zy) {
      if (iterations === maxIterations) {
        return [0, 0, 0];
      }
      
      const smoothed = iterations + 1 - Math.log(Math.log(Math.abs(zx * zx + zy * zy))) / Math.log(2);
      const normalized = smoothed / maxIterations;
      
      const hue = 360 * normalized;
      const saturation = 0.7;
      const lightness = 0.5;
      
      return hslToRgb(hue, saturation, lightness);
    }
    
    function hslToRgb(h, s, l) {
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l;
      } else {
        const hueToRgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hueToRgb(p, q, (h / 360 + 1/3) % 1);
        g = hueToRgb(p, q, (h / 360) % 1);
        b = hueToRgb(p, q, (h / 360 - 1/3) % 1);
      }
      
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    function calculateJulia() {
      const scale = 4 / (zoomLevel * Math.min(width, height));
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let zx = scale * (x - width / 2);
          let zy = scale * (y - height / 2);
          
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
          
          const [r, g, b] = getColor(iterations, maxIterations, lastZx, lastZy);
          const pos = (y * width + x) * 4;
          
          data[pos] = r;
          data[pos + 1] = g;
          data[pos + 2] = b;
          data[pos + 3] = 255;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    function updateJulia() {
      cReal = parseFloat(realSlider.value);
      cImag = parseFloat(imagSlider.value);
      maxIterations = parseInt(iterSlider.value);
      zoomLevel = parseFloat(zoomSlider.value);
      
      realValue.textContent = cReal.toFixed(2);
      imagValue.textContent = cImag.toFixed(2);
      iterValue.textContent = maxIterations;
      zoomValue.textContent = zoomLevel.toFixed(1);
      
      calculateJulia();
    }
    
    realSlider.addEventListener('input', updateJulia);
    imagSlider.addEventListener('input', updateJulia);
    iterSlider.addEventListener('input', updateJulia);
    zoomSlider.addEventListener('input', updateJulia);
    
    preset1.addEventListener('click', () => {
      realSlider.value = -0.7;
      imagSlider.value = 0.27;
      updateJulia();
    });
    
    preset2.addEventListener('click', () => {
      realSlider.value = -0.4;
      imagSlider.value = 0.6;
      updateJulia();
    });
    
    preset3.addEventListener('click', () => {
      realSlider.value = 0.285;
      imagSlider.value = 0.01;
      updateJulia();
    });
    
    preset4.addEventListener('click', () => {
      realSlider.value = -0.8;
      imagSlider.value = 0.156;
      updateJulia();
    });
    
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `julia-set-${cReal.toFixed(2)}-${cImag.toFixed(2)}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
    
    calculateJulia();
  });