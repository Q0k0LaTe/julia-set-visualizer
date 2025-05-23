# Julia Set Fractal Visualizer

![Julia Set Example](https://raw.githubusercontent.com/Q0k0LaTe/julia-set-visualizer/master/screenshots/example.png)

An interactive web application for exploring and visualizing Julia set fractals using Node.js and HTML5 Canvas.

## Features

- Real-time interactive visualization of Julia set fractals
- Adjust complex parameters with intuitive sliders
- Zoom in/out to explore fractal details
- Smooth color rendering using HSL color mapping
- Save your generated fractals as PNG images
- Preset configurations for interesting Julia sets
- Responsive design that works on various devices

## Live Demo

https://julia-set-visualizer.onrender.com/

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v12.0 or higher)
- npm (usually comes with Node.js)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/julia-set-visualizer.git
   cd julia-set-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How It Works

The Julia set is a fractal that emerges from complex dynamics. For each point z on the complex plane, we iterate the function:

```
f(z) = z² + c
```

Where c is a complex constant. The Julia set is the boundary between points that escape to infinity under iteration and points that remain bounded.

The visualization uses the "escape time algorithm":
1. For each pixel, we map it to a complex number z
2. We iterate z = z² + c until either:
   - |z| > 2 (point escapes)
   - We reach the maximum iteration count (point is likely in the set)
3. We color the pixel based on how quickly it escaped

## Project Structure

```
julia-set-visualizer/
├── server.js              # Express.js server
├── package.json           # Project configuration
├── public/                # Static files
│   ├── index.html         # Main HTML interface
│   └── julia.js           # Julia set calculation logic
└── screenshots/           # Example images
```

## Mathematical Background

Julia sets are named after the French mathematician Gaston Julia who studied them in the early 20th century. Each Julia set is determined by a complex parameter c, which creates a unique fractal pattern.

The color patterns you see represent:
- **Black region**: Points in the Julia set (never escape)
- **Colored regions**: Points outside the set, with colors indicating how quickly they escape
- **Boundary between regions**: The actual Julia set fractal

## Customization

### Changing Colors

You can modify the coloring algorithm in `public/julia.js`:

```javascript
function getColor(iterations, maxIterations, zx, zy) {
  // Change the HSL parameters
  const hue = 360 * normalized; // Controls the color spectrum
  const saturation = 0.7;       // Color intensity
  const lightness = 0.5;        // Brightness
  
  return hslToRgb(hue, saturation, lightness);
}
```

### Adding More Presets

Add more preset buttons in `public/index.html` and corresponding event listeners in `public/julia.js`.

## Performance Notes

- The calculation is CPU-intensive, especially with high iteration counts
- Zooming in requires more iterations for detail
- Larger canvas sizes require more computational power

## Deployment

### Heroku

```bash
heroku create
git push heroku main
```

### Vercel

```bash
npm install -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by the mathematical work of Gaston Julia and Benoit Mandelbrot
- Built with HTML5 Canvas and Express.js