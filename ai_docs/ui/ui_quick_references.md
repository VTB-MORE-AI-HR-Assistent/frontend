# VTB AI HR Assistant - UI Quick Reference Guide

## 🚀 Quick Copy-Paste Components

### Navigation Bar (VTB Branded)

```tsx
<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* VTB Logo */}
      <a href="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">VTB</span>
        </div>
        <span className="text-xl font-semibold text-slate-900">AI HR Assistant</span>
      </a>

      {/* Nav Links */}
      <div className="flex items-center space-x-8">
        <a href="/dashboard" className="text-slate-600 hover:text-slate-900 transition-colors">
          Dashboard
        </a>
        <a href="/candidates" className="text-slate-600 hover:text-slate-900 transition-colors">
          Candidates
        </a>
        <a href="/interviews" className="text-slate-600 hover:text-slate-900 transition-colors">
          Interviews
        </a>
        <button className="px-5 py-2.5 bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white rounded-lg hover:shadow-lg transition-all duration-200">
          Start Interview
        </button>
      </div>
    </div>
  </div>
</nav>
```

### Hero Section (HR Dashboard)

```tsx
<section class="pt-32 pb-20 px-6 text-center">
  <div class="max-w-4xl mx-auto">
    {/* VTB Badge */}
    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-full mb-8">
      <svg className="w-5 h-5 text-[#1B4F8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span className="text-sm font-medium text-[#1B4F8C]">AI-Powered HR Platform</span>
    </div>

    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
      Transform Your Hiring with
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B4F8C] to-[#2563EB]">
        {' '}
        AI Intelligence
      </span>
    </h1>

    <p class="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
      Your subheadline description goes here. Make it compelling and clear.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button className="px-8 py-4 bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200">
        Create New Vacancy
      </button>
      <button className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200">
        View Candidates
      </button>
    </div>
  </div>
</section>
```

### Feature Card

```erb
<div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200">
  <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-6">
    <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <!-- Your icon here -->
    </svg>
  </div>
  <h3 class="text-xl font-semibold text-slate-900 mb-3">Feature Title</h3>
  <p class="text-slate-600 mb-4">
    Feature description that explains the benefit clearly and concisely.
  </p>
  <a href="#" class="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
    Learn more
    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </a>
</div>
```

### Dark Section

```erb
<section class="px-6 py-20 bg-slate-900 text-white">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold mb-4">Section Title</h2>
      <p class="text-xl text-slate-400 max-w-3xl mx-auto">
        Section description with muted text color
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Dark cards -->
      <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 class="text-xl font-semibold mb-3">Card Title</h3>
        <p class="text-slate-400">Card content</p>
      </div>
    </div>
  </div>
</section>
```

### CTA Section

```erb
<section class="px-6 py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
  <div class="max-w-4xl mx-auto text-center text-white">
    <h2 class="text-4xl font-bold mb-6">Ready to get started?</h2>
    <p class="text-xl mb-12 text-blue-100">
      Join thousands of users already benefiting
    </p>

    <a href="#" class="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-200">
      Start Free Trial
    </a>

    <p class="mt-8 text-sm text-blue-200">
      No credit card required • Free forever
    </p>
  </div>
</section>
```

### Footer

```erb
<footer class="bg-slate-900 text-slate-400 py-12 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-4 gap-8 mb-8">
      <div>
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-xl">CV</span>
          </div>
          <span class="text-xl font-semibold text-white">CVReady</span>
        </div>
        <p class="text-sm">Your tagline here</p>
      </div>

      <!-- Footer columns -->
    </div>

    <div class="border-t border-slate-800 pt-8 text-center text-sm">
      <p>&copy; 2024 CVReady. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## 🎨 VTB Brand Color Classes

### VTB Primary Colors

```typescript
// CSS Variables
'--vtb-blue': '#1B4F8C'        // Primary VTB Blue
'--vtb-blue-dark': '#143A66'   // Darker variant
'--vtb-blue-light': '#2563EB'  // Lighter variant
'--vtb-sky': '#3B82F6'         // Sky blue accent
'--vtb-indigo': '#4F46E5'      // Indigo accent
```

### Backgrounds

```
VTB Primary: bg-[#1B4F8C]
Light: bg-slate-50, bg-blue-50, bg-green-50
Cards: bg-white with border-slate-200
Dark: bg-slate-900, bg-slate-800
VTB Gradient: bg-gradient-to-r from-[#1B4F8C] to-[#2563EB]
```

### Text Colors

```
Primary: text-slate-900
Secondary: text-slate-600
Muted: text-slate-400
VTB Accent: text-[#1B4F8C]
Success: text-green-600
Error: text-red-600
White: text-white (on dark backgrounds)
```

### VTB Gradients

```tsx
// Primary VTB gradient
className = 'bg-gradient-to-r from-[#1B4F8C] to-[#2563EB]'

// Hover state gradient
className = 'hover:from-[#143A66] hover:to-[#1B4F8C]'

// Light gradient background
className = 'bg-gradient-to-br from-slate-50 via-white to-blue-50'

// Card accent gradient
className = 'bg-gradient-to-br from-blue-50 to-indigo-50'

// Success gradient
className = 'bg-gradient-to-r from-green-500 to-emerald-600'

// Warning gradient
className = 'bg-gradient-to-r from-amber-500 to-orange-600'
```

### HR Status Colors

```tsx
// Candidate Status
<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Approved</span>
<span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">Pending</span>
<span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Rejected</span>

// Interview Status
<span className="px-3 py-1 bg-blue-100 text-[#1B4F8C] rounded-full">Scheduled</span>
<span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">Completed</span>
<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Passed</span>
```

## 📏 Spacing Cheat Sheet

### Padding

```
Small: p-4
Medium: p-6 or p-8
Large: p-12
Section: py-20 px-6
```

### Margins

```
Between elements: mb-4
Between sections: mb-8 or mb-16
Between paragraphs: mb-6
```

### Gaps (for flex/grid)

```
Small: gap-4
Medium: gap-6 or gap-8
Large: gap-12
```

## 🎯 Component States

### Hover Effects

```erb
<!-- Basic hover -->
hover:shadow-lg transition-all duration-200

<!-- With transform -->
hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5

<!-- Color change -->
hover:text-slate-900 transition-colors

<!-- Background change -->
hover:bg-slate-200 transition-all duration-200
```

### Focus States

```erb
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
```

## 📱 Responsive Utilities

### Hide/Show

```erb
<!-- Hide on mobile, show on desktop -->
hidden md:block

<!-- Show on mobile, hide on desktop -->
block md:hidden
```

### Grid Columns

```erb
<!-- 1 column mobile, 2 tablet, 3 desktop -->
grid md:grid-cols-2 lg:grid-cols-3 gap-8

<!-- 1 column mobile, 2 desktop -->
grid md:grid-cols-2 gap-12
```

### Text Sizes

```erb
<!-- Responsive heading -->
text-4xl md:text-5xl lg:text-6xl

<!-- Responsive body text -->
text-lg md:text-xl
```

## 🚀 Rails Helpers

### Button Helper

```ruby
def gradient_button(text, path, options = {})
  link_to path,
    class: "px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 #{options[:class]}" do
    text
  end
end
```

### Card Helper

```ruby
def feature_card(title:, description:, icon_path: nil, &block)
  content_tag :div, class: "bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200" do
    icon_html = content_tag(:div, class: "w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-6") do
      # Icon content
    end

    icon_html +
    content_tag(:h3, title, class: "text-xl font-semibold text-slate-900 mb-3") +
    content_tag(:p, description, class: "text-slate-600 mb-4") +
    (block_given? ? capture(&block) : "")
  end
end
```

## 🎯 HR-Specific Components

### Candidate Card

```tsx
<div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200">
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-full flex items-center justify-center">
        <span className="text-white font-bold">JD</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">John Doe</h3>
        <p className="text-sm text-slate-600">Senior Developer</p>
      </div>
    </div>
    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">85% Match</span>
  </div>

  <div className="space-y-2 mb-4">
    <div className="flex items-center text-sm text-slate-600">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 13.255A8.997 8.997 0 0112 15a8.997 8.997 0 01-9-1.745M21 13.255V8.59a1 1 0 00-1-1h-4.665M3 13.255V8.59a1 1 0 011-1h4.665"
        ></path>
      </svg>
      5 years experience
    </div>
    <div className="flex items-center text-sm text-slate-600">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      Interview scheduled
    </div>
  </div>

  <div className="flex space-x-2">
    <button className="flex-1 px-4 py-2 bg-[#1B4F8C] text-white rounded-lg hover:bg-[#143A66] transition-colors">
      View Profile
    </button>
    <button className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
      Schedule Interview
    </button>
  </div>
</div>
```

### Interview Progress Bar

```tsx
<div className="bg-white rounded-xl p-6 border border-slate-200">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-slate-900">Interview Progress</h3>
    <span className="text-sm text-slate-600">Step 3 of 5</span>
  </div>

  <div className="relative">
    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] rounded-full transition-all duration-500"
        style={{ width: '60%' }}
      ></div>
    </div>

    <div className="flex justify-between mt-4">
      <span className="text-xs text-green-600">✓ Resume</span>
      <span className="text-xs text-green-600">✓ Technical</span>
      <span className="text-xs text-[#1B4F8C] font-semibold">● Behavioral</span>
      <span className="text-xs text-slate-400">Questions</span>
      <span className="text-xs text-slate-400">Complete</span>
    </div>
  </div>
</div>
```

### Vacancy Card

```tsx
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-xl font-semibold text-slate-900">Senior Frontend Developer</h3>
      <p className="text-slate-600 mt-1">Engineering Team • Remote</p>
    </div>
    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Active</span>
  </div>

  <div className="grid grid-cols-3 gap-4 mb-4">
    <div>
      <p className="text-sm text-slate-600">Applications</p>
      <p className="text-2xl font-bold text-[#1B4F8C]">47</p>
    </div>
    <div>
      <p className="text-sm text-slate-600">Interviewed</p>
      <p className="text-2xl font-bold text-[#1B4F8C]">12</p>
    </div>
    <div>
      <p className="text-sm text-slate-600">Shortlisted</p>
      <p className="text-2xl font-bold text-[#1B4F8C]">3</p>
    </div>
  </div>

  <button className="w-full px-4 py-2 bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white rounded-lg hover:shadow-lg transition-all duration-200">
    View Candidates
  </button>
</div>
```

### Interview Score Display

```tsx
<div className="bg-white rounded-xl p-6 border border-slate-200">
  <h3 className="text-lg font-semibold text-slate-900 mb-4">AI Assessment Score</h3>

  <div className="text-center mb-6">
    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] text-white">
      <div>
        <p className="text-3xl font-bold">78%</p>
        <p className="text-sm opacity-90">Overall Match</p>
      </div>
    </div>
  </div>

  <div className="space-y-3">
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">Technical Skills</span>
        <span className="font-semibold text-slate-900">85%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
      </div>
    </div>

    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">Communication</span>
        <span className="font-semibold text-slate-900">72%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-2 bg-amber-500 rounded-full" style={{ width: '72%' }}></div>
      </div>
    </div>

    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">Cultural Fit</span>
        <span className="font-semibold text-slate-900">90%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
      </div>
    </div>
  </div>
</div>
```

## 💡 Pro Tips

1. **Always use transitions** for interactive elements
2. **Layer gradients** for depth (background gradient + card gradient)
3. **Use consistent border radius**: rounded-lg, rounded-xl, rounded-2xl
4. **Add shadows on hover** for interactive feedback
5. **Keep text readable** with proper contrast ratios
6. **Use semantic HTML** for better accessibility
7. **Test on mobile first** - the design should work on small screens

## 🎁 Full Page Template

```erb
<% content_for :title, "Page Title - CVReady" %>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
  <%= render 'shared/navigation' %>

  <main>
    <%= render 'hero_section' %>
    <%= render 'features_grid' %>
    <%= render 'testimonials' %>
    <%= render 'cta_section' %>
  </main>

  <%= render 'shared/footer' %>
</div>
```

This quick reference guide provides everything needed to maintain consistent design across the application!
