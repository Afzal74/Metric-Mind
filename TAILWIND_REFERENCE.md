# Tailwind CSS Reference for Forensic Gender Classifier

## 🎨 Custom Color Palette

### Primary Colors
- `text-primary-500` - Blue (#3b82f6)
- `bg-primary-600` - Darker blue (#2563eb)
- `border-primary-700` - Darkest blue (#1d4ed8)

### Success Colors
- `text-success-500` - Green (#22c55e)
- `bg-success-600` - Darker green (#16a34a)

### Error Colors
- `text-error-500` - Red (#ef4444)
- `bg-error-600` - Darker red (#dc2626)

## 🎭 Custom Component Classes

### Background & Layout
- `.gradient-bg` - Main background with animated gradients
- `.glass-card` - Glass morphism card effect
- `.dashboard-card` - Main dashboard card styling
- `.cyber-grid` - Cyberpunk grid background pattern

### Typography
- `.orbitron-font` - Futuristic Orbitron font
- `.space-grotesk-font` - Modern Space Grotesk font
- `.jetbrains-font` - Monospace JetBrains Mono font

### Interactive Elements
- `.stat-card` - Animated statistic cards with hover effects
- `.dark-input` - Dark themed input fields
- `.metric-gradient` - Purple gradient background

### Result Cards
- `.result-card-success` - Green themed success cards
- `.result-card-error` - Red themed error cards

### Effects & Animations
- `.floating-animation` - Gentle floating animation
- `.pulse-glow` - Pulsing glow effect
- `.neon-glow` - Neon glow box shadow
- `.holographic-border` - Holographic border effect
- `.data-visualization` - Data visualization container

## 🚀 Common Tailwind Utility Patterns

### Spacing & Layout
```css
/* Padding */
p-4 p-6 p-8 px-4 py-6

/* Margin */
m-4 mx-auto my-8 mt-4 mb-6

/* Flexbox */
flex flex-col flex-row items-center justify-between gap-4

/* Grid */
grid grid-cols-2 grid-cols-3 gap-4 gap-6
```

### Colors & Backgrounds
```css
/* Text Colors */
text-white text-gray-100 text-gray-400 text-blue-400

/* Background Colors */
bg-black bg-gray-900 bg-blue-500/20 bg-gradient-to-r

/* Borders */
border border-gray-800 border-blue-500/30 rounded-lg rounded-xl
```

### Effects & Transitions
```css
/* Shadows */
shadow-lg shadow-2xl shadow-blue-500/20

/* Backdrop Effects */
backdrop-blur-xl backdrop-blur-sm

/* Transitions */
transition-all duration-300 hover:scale-105 hover:shadow-2xl
```

### Responsive Design
```css
/* Mobile First */
text-sm md:text-lg lg:text-xl
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
p-4 md:p-6 lg:p-8
```

## 💡 Usage Examples

### Modern Button
```jsx
<button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
  Analyze
</button>
```

### Glass Card
```jsx
<div className="glass-card p-6 rounded-xl">
  <h3 className="orbitron-font text-xl text-white mb-4">Results</h3>
  <p className="text-gray-300">Content here...</p>
</div>
```

### Animated Stat Card
```jsx
<div className="stat-card floating-animation">
  <div className="text-2xl orbitron-font text-primary-400">75%</div>
  <div className="text-gray-400">Accuracy</div>
</div>
```

### Input Field
```jsx
<input 
  className="dark-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400/50 transition-all"
  placeholder="Enter measurement..."
/>
```

## 🎯 Pro Tips

1. **Combine custom classes with utilities**: `className="glass-card p-6 hover:scale-105"`
2. **Use opacity modifiers**: `bg-blue-500/20` for 20% opacity
3. **Stack effects**: `shadow-2xl hover:shadow-blue-500/30 transition-all duration-500`
4. **Responsive breakpoints**: `sm:` `md:` `lg:` `xl:` `2xl:`
5. **Dark mode ready**: All colors work perfectly with the black theme