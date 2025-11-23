# Animation Quick Reference Card

## 🎨 Common Animation Classes

### Background Effects
```html
<!-- Animated gradient background -->
<div className="gradient-bg-animated">

<!-- Floating orbs -->
<div className="floating-orb">
<div className="floating-orb-delayed">
```

### Entrance Animations
```html
<!-- Fade in -->
<div className="fade-in">

<!-- Fade in with upward motion -->
<div className="fade-in-up">

<!-- Slide from left -->
<div className="slide-in-left">

<!-- Slide from right -->
<div className="slide-in-right">

<!-- Scale and fade -->
<div className="scale-in">
```

### Interactive Elements
```html
<!-- Card with hover lift -->
<div className="card-hover">

<!-- Smooth button -->
<button className="button-smooth">

<!-- Gentle glow pulse -->
<div className="gentle-glow">

<!-- Slow pulse -->
<div className="pulse-slow">
```

### Text Effects
```html
<!-- Animated gradient text -->
<span className="gradient-text-animated">
  Your Text Here
</span>
```

### Glass Effects
```html
<!-- Standard glass effect -->
<div className="glassmorphism">

<!-- Light variant -->
<div className="glassmorphism-light">
```

---

## 🚀 Hero Section Pattern

```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
  {/* Animated Background */}
  <div className="absolute inset-0 gradient-bg-animated opacity-70"></div>
  
  {/* Floating Orbs */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full floating-orb opacity-20"
         style={{
           background: "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)",
           filter: "blur(40px)"
         }}>
    </div>
  </div>
  
  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4">
    <h1 className="fade-in-up">Your Heading</h1>
    <p className="fade-in-up" style={{ animationDelay: "200ms" }}>
      Your description
    </p>
  </div>
</section>
```

---

## 📊 Stats Card Pattern

```tsx
<div className="glassmorphism rounded-2xl p-6 card-hover smooth-transition">
  {/* Icon */}
  <div className="flex items-center justify-center mb-3">
    <CheckCircle className="w-8 h-8 text-green-400 smooth-transition group-hover:scale-110" />
  </div>
  
  {/* Number */}
  <div className="text-4xl font-bold text-white mb-2 smooth-transition group-hover:scale-105">
    99.9%
  </div>
  
  {/* Label */}
  <div className="text-gray-300 text-sm font-medium mb-3">
    Success Rate
  </div>
  
  {/* Progress Bar */}
  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
    <div className="h-2 rounded-full smooth-transition"
         style={{
           width: "99%",
           background: "linear-gradient(90deg, #10b981, #34d399)"
         }}>
    </div>
  </div>
</div>
```

---

## 🎯 Button Patterns

### Primary Button
```tsx
<Button
  variant="primary"
  size="lg"
  className="button-smooth focus-ring px-8 py-4 shadow-lg hover:shadow-xl smooth-transition hover:scale-105"
>
  Get Started
</Button>
```

### Ghost Button
```tsx
<Button
  variant="ghost"
  size="lg"
  className="button-smooth focus-ring border-2 border-blue-400/50 hover:border-blue-400 px-8 py-4 smooth-transition hover:scale-105"
>
  Learn More
</Button>
```

---

## 🎭 Staggered Animation Pattern

```tsx
{items.map((item, index) => (
  <div
    key={index}
    className={`fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    style={{ animationDelay: `${index * 150}ms` }}
  >
    {item.content}
  </div>
))}
```

---

## 🌈 Gradient Patterns

### Background Gradients
```css
/* Subtle animated gradient */
background: linear-gradient(
  -45deg,
  rgba(59, 130, 246, 0.1),
  rgba(139, 92, 246, 0.1),
  rgba(236, 72, 153, 0.1),
  rgba(59, 130, 246, 0.1)
);
background-size: 400% 400%;
```

### Text Gradients
```css
background: linear-gradient(
  90deg,
  var(--neon-blue),
  var(--neon-green),
  var(--neon-blue)
);
background-size: 200% 200%;
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 🎪 Floating Orb Pattern

```tsx
<div
  className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full floating-orb opacity-20"
  style={{
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)",
    filter: "blur(40px)",
    animationDelay: "0s"
  }}
></div>
```

---

## ⚡ Performance Tips

### Do's ✅
```tsx
// Use transform instead of position
<div style={{ transform: 'translateY(-10px)' }}>

// Stagger animations
style={{ animationDelay: `${index * 150}ms` }}

// GPU acceleration
className="will-change-transform"

// Smooth transitions
className="smooth-transition"
```

### Don'ts ❌
```tsx
// Don't animate layout properties
style={{ top: '10px' }} // ❌

// Don't use too many particles
particleCount: 200 // ❌ Use 40 max

// Don't forget accessibility
// ❌ Missing reduced motion support
```

---

## 🔧 Utility Classes

```css
.smooth-transition     /* All: 0.3s cubic-bezier ease */
.will-change-transform /* Optimize for transform animations */
.will-change-opacity   /* Optimize for opacity animations */
.focus-ring           /* Accessible focus indicator */
.text-shadow          /* Subtle text shadow */
.gradient-mesh        /* Light gradient overlay */
```

---

## 📱 Responsive Patterns

```tsx
{/* Desktop: Show complex animation */}
<div className="hidden md:block floating-orb">

{/* Mobile: Simpler alternative */}
<div className="md:hidden simple-gradient">

{/* Adjust animation speed on mobile */}
<style>
  @media (max-width: 768px) {
    .floating-orb {
      animation-duration: 30s;
    }
  }
</style>
```

---

## 🎨 Color Variables

```css
--neon-blue: #3b82f6
--neon-green: #10b981
--neon-red: #ef4444
--neon-yellow: #f59e0b
```

---

## 🌐 Simple Background Options

### Option 1: Gradient Only (Best Performance)
```tsx
<div className="absolute inset-0 gradient-bg-animated opacity-70"></div>
```

### Option 2: Gradient + Orbs (Good Performance)
```tsx
<div className="absolute inset-0 gradient-bg-animated opacity-70"></div>
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {/* 4 floating orbs */}
</div>
```

### Option 3: Particles (Moderate Performance)
```tsx
<ParticleBackground />
```

---

## 🧪 Testing Commands

```bash
# Check performance
npm run build
npm run preview

# Test on mobile
# Use Chrome DevTools Device Mode

# Check accessibility
# Use Lighthouse in Chrome DevTools
```

---

## 📋 Checklist for New Animations

- [ ] Uses GPU-accelerated properties only
- [ ] Duration is 150ms-500ms (or 3s+ for ambient)
- [ ] Has animation-delay for staggering
- [ ] Includes reduced-motion support
- [ ] Tested on mobile devices
- [ ] Smooth at 60fps
- [ ] Has proper z-index layering
- [ ] Accessible (doesn't rely on animation for info)

---

## 🎬 Animation Timing Guide

| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover) | 150-200ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Standard (click) | 300-500ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Entrance | 500-700ms | ease-out |
| Background | 3-20s | ease / linear |
| Pulse | 2-4s | ease-in-out |

---

**Pro Tip**: When in doubt, use `smooth-transition` class for all interactive elements!