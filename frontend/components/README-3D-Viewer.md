# 3D Mandible Viewer Feature

## Overview
The Interactive 3D Mandible Osteometric Viewer is a React component built with React Three Fiber that provides an immersive visualization of forensic mandibular landmarks and measurements.

## Features

### 🎯 Interactive 3D Model
- **Orbit Controls**: Mouse-based rotation, zoom, and pan
- **Anatomically Accurate**: Simplified but proportionally correct mandible geometry
- **Real-time Rendering**: Smooth 60fps 3D visualization

### 📏 Measurement Visualization
- **15 Forensic Measurements**: All dataset features (M1-M15)
- **Dynamic Camera**: Auto-focus on selected measurement regions
- **Measurement Lines**: 3D lines showing exact measurement paths
- **Anatomical Landmarks**: Interactive spheres at key anatomical points

### 🔄 Gender Morphing
- **Sexual Dimorphism**: Visual representation of male vs female differences
- **Smooth Animation**: 2-second morphing transition
- **Real-time Scaling**: Geometry adapts based on gender characteristics
- **Progress Indicator**: Visual feedback during morphing

### 🎨 Visual Features
- **Landmark Tooltips**: Hover to see anatomical names
- **Feature Highlighting**: Selected measurements are emphasized
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Consistent with app design

## Technical Implementation

### Dependencies
```json
{
  "@react-three/fiber": "^9.4.0",
  "@react-three/drei": "^9.88.0",
  "three": "^0.158.0",
  "framer-motion": "^10.16.5"
}
```

### Components Structure
```
components/
├── mandible-viewer.tsx      # Main viewer component
├── mandible-geometry.tsx    # 3D geometry definition
└── navbar.tsx              # Navigation with viewer link
```

### Key Features Implementation

#### 1. Measurement Selection
```typescript
const handleFeatureSelect = (featureId: string) => {
  const feature = MANDIBLE_FEATURES.find(f => f.id === featureId)
  if (feature) {
    setSelectedFeature(featureId)
    setCameraPosition(feature.viewAngle.position)
    setCameraTarget(feature.viewAngle.target)
  }
}
```

#### 2. Gender Morphing
```typescript
const handleMorphToggle = () => {
  // Smooth animation from female (0) to male (1)
  const targetMorph = showVariation ? 0 : 1
  // Animate over 2 seconds with easing
}
```

#### 3. Camera Animation
```typescript
function CameraController({ targetPosition, targetLookAt }) {
  // Smooth camera transitions using lerp
  camera.position.lerpVectors(startPos, endPos, eased)
  camera.lookAt(...targetLookAt)
}
```

## Usage

### Basic Implementation
```tsx
import { MandibleViewer } from '@/components/mandible-viewer'

export default function ViewerPage() {
  return (
    <MandibleViewer 
      maleMean={maleData}
      femaleMean={femaleData}
    />
  )
}
```

### Navigation Integration
The viewer is accessible through:
- **Navbar**: "3D Viewer" link
- **Main Page**: "Explore 3D Mandible Viewer" button
- **Direct URL**: `/viewer`

## Anatomical Accuracy

### Measurements Implemented
1. **M1 Length**: Gonion to Gnathion distance
2. **M2 Bicondylar breadth**: Width between condyles
3. **M7 Condylar Ramus Height**: Condyle to gonion height
4. **M9 Gonial angle**: Ramus-body angle visualization
5. **M12 C-C Distance**: Coronoid process separation

### Sexual Dimorphism Features
- **Size**: Males 10-15% larger overall
- **Width**: More pronounced in bicondylar breadth
- **Robusticity**: Thicker bone appearance in males
- **Gonial Angle**: More pronounced corners in males
- **Mental Protuberance**: More prominent chin in males

## Performance Optimizations

### Rendering
- **Instanced Geometry**: Reused geometries for landmarks
- **Level of Detail**: Simplified geometry for performance
- **Frustum Culling**: Only render visible elements
- **Efficient Materials**: Optimized shader usage

### Memory Management
- **Geometry Disposal**: Proper cleanup of Three.js objects
- **Texture Optimization**: Minimal texture usage
- **Component Unmounting**: Clean disposal on component unmount

## Browser Compatibility
- **WebGL Support**: Requires WebGL-enabled browser
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+
- **Mobile Support**: iOS Safari, Chrome Mobile
- **Fallback**: Graceful degradation for unsupported browsers

## Future Enhancements

### Planned Features
- **Real 3D Models**: Integration with actual mandible .glb files
- **Texture Mapping**: Realistic bone textures
- **Animation Presets**: Predefined camera tours
- **Measurement Tools**: Interactive measurement capabilities
- **Export Features**: Screenshot and 3D model export
- **VR Support**: WebXR integration for immersive viewing

### Educational Enhancements
- **Guided Tours**: Step-by-step anatomy lessons
- **Quiz Mode**: Interactive learning assessments
- **Comparison Mode**: Side-by-side gender comparison
- **Historical Data**: Evolution of measurement techniques

## Troubleshooting

### Common Issues
1. **Black Screen**: Check WebGL support
2. **Performance Issues**: Reduce geometry complexity
3. **Mobile Rendering**: Optimize for lower-end devices
4. **Memory Leaks**: Ensure proper Three.js cleanup

### Debug Mode
Enable debug mode by adding `?debug=true` to URL for:
- Performance metrics
- Geometry wireframes
- Camera position logging
- Memory usage monitoring