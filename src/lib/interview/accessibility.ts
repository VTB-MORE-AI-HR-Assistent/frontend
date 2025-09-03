// Phase 6.3: Accessibility Features for Interview
"use client"

import { useEffect, useCallback } from 'react'

// Screen reader announcements
export class ScreenReaderAnnouncer {
  private static announcer: HTMLDivElement | null = null

  static init() {
    if (typeof window === 'undefined') return
    
    if (!this.announcer) {
      this.announcer = document.createElement('div')
      this.announcer.setAttribute('role', 'status')
      this.announcer.setAttribute('aria-live', 'polite')
      this.announcer.setAttribute('aria-atomic', 'true')
      this.announcer.className = 'sr-only' // Visually hidden but accessible to screen readers
      this.announcer.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `
      document.body.appendChild(this.announcer)
    }
  }

  static announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.announcer) this.init()
    if (this.announcer) {
      this.announcer.setAttribute('aria-live', priority)
      this.announcer.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        if (this.announcer) {
          this.announcer.textContent = ''
        }
      }, 1000)
    }
  }

  static destroy() {
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer)
      this.announcer = null
    }
  }
}

// Keyboard navigation manager
export class KeyboardNavigationManager {
  private static listeners: Map<string, (e: KeyboardEvent) => void> = new Map()
  
  static registerShortcut(
    key: string,
    modifier: 'ctrl' | 'alt' | 'meta' | 'shift' | null,
    callback: () => void,
    description?: string
  ) {
    const id = `${modifier || ''}-${key}`
    
    const handler = (e: KeyboardEvent) => {
      const modifierPressed = modifier ? 
        (modifier === 'ctrl' && e.ctrlKey) ||
        (modifier === 'alt' && e.altKey) ||
        (modifier === 'meta' && e.metaKey) ||
        (modifier === 'shift' && e.shiftKey) : true
      
      if (e.key.toLowerCase() === key.toLowerCase() && modifierPressed) {
        e.preventDefault()
        callback()
        if (description) {
          ScreenReaderAnnouncer.announce(description)
        }
      }
    }
    
    // Remove existing listener if any
    this.unregisterShortcut(id)
    
    // Add new listener
    this.listeners.set(id, handler)
    window.addEventListener('keydown', handler)
  }
  
  static unregisterShortcut(id: string) {
    const handler = this.listeners.get(id)
    if (handler) {
      window.removeEventListener('keydown', handler)
      this.listeners.delete(id)
    }
  }
  
  static unregisterAll() {
    this.listeners.forEach((handler) => {
      window.removeEventListener('keydown', handler)
    })
    this.listeners.clear()
  }
  
  static getShortcuts(): string[] {
    return Array.from(this.listeners.keys())
  }
}

// Focus management
export class FocusManager {
  private static focusTrap: HTMLElement | null = null
  private static previousFocus: HTMLElement | null = null
  
  static trapFocus(container: HTMLElement) {
    this.previousFocus = document.activeElement as HTMLElement
    
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement
    
    if (firstFocusable) {
      firstFocusable.focus()
    }
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey)
    this.focusTrap = container
  }
  
  static releaseFocus() {
    if (this.focusTrap) {
      this.focusTrap.removeEventListener('keydown', () => {})
      this.focusTrap = null
    }
    
    if (this.previousFocus) {
      this.previousFocus.focus()
      this.previousFocus = null
    }
  }
}

// High contrast mode detection and management
export class HighContrastManager {
  private static isHighContrast = false
  private static listeners: Set<(enabled: boolean) => void> = new Set()
  
  static init() {
    if (typeof window === 'undefined') return
    
    // Check for high contrast mode preference
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    this.isHighContrast = mediaQuery.matches
    
    // Listen for changes
    mediaQuery.addEventListener('change', (e) => {
      this.isHighContrast = e.matches
      this.notifyListeners()
    })
    
    // Also check for forced colors
    const forcedColors = window.matchMedia('(forced-colors: active)')
    if (forcedColors.matches) {
      this.isHighContrast = true
    }
  }
  
  static isEnabled(): boolean {
    return this.isHighContrast
  }
  
  static addListener(callback: (enabled: boolean) => void) {
    this.listeners.add(callback)
  }
  
  static removeListener(callback: (enabled: boolean) => void) {
    this.listeners.delete(callback)
  }
  
  private static notifyListeners() {
    this.listeners.forEach(callback => callback(this.isHighContrast))
  }
  
  static getHighContrastStyles(): React.CSSProperties {
    if (!this.isHighContrast) return {}
    
    return {
      borderWidth: '2px',
      outline: '2px solid currentColor',
      outlineOffset: '2px'
    }
  }
}

// Audio cues for events
export class AudioCues {
  private static audioContext: AudioContext | null = null
  private static sounds: Map<string, AudioBuffer> = new Map()
  
  static init() {
    if (typeof window === 'undefined') return
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.createSounds()
    } catch (error) {
      console.warn('Audio cues not available:', error)
    }
  }
  
  private static createSounds() {
    if (!this.audioContext) return
    
    // Create simple synthesized sounds
    this.createBeep('success', 880, 0.1) // A5
    this.createBeep('error', 440, 0.15) // A4
    this.createBeep('notification', 660, 0.08) // E5
    this.createBeep('warning', 550, 0.12) // C#5
  }
  
  private static createBeep(name: string, frequency: number, duration: number) {
    if (!this.audioContext) return
    
    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const channel = buffer.getChannelData(0)
    
    for (let i = 0; i < length; i++) {
      channel[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 
                   Math.exp(-i / (length * 0.3)) // Exponential decay
    }
    
    this.sounds.set(name, buffer)
  }
  
  static play(soundName: 'success' | 'error' | 'notification' | 'warning', volume: number = 0.3) {
    if (!this.audioContext || this.audioContext.state === 'suspended') {
      // Try to resume audio context
      this.audioContext?.resume()
    }
    
    const buffer = this.sounds.get(soundName)
    if (!buffer || !this.audioContext) return
    
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    
    source.buffer = buffer
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    gainNode.gain.value = volume
    
    source.start()
  }
  
  static destroy() {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.sounds.clear()
  }
}

// Reduced motion preference
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  return mediaQuery.matches
}

// Custom hook for keyboard navigation
export function useKeyboardNavigation(
  shortcuts: Array<{
    key: string
    modifier?: 'ctrl' | 'alt' | 'meta' | 'shift' | null
    action: () => void
    description?: string
  }>
) {
  useEffect(() => {
    shortcuts.forEach(({ key, modifier, action, description }) => {
      KeyboardNavigationManager.registerShortcut(key, modifier || null, action, description)
    })
    
    return () => {
      KeyboardNavigationManager.unregisterAll()
    }
  }, [shortcuts])
}

// Custom hook for screen reader announcements
export function useScreenReader() {
  useEffect(() => {
    ScreenReaderAnnouncer.init()
    
    return () => {
      ScreenReaderAnnouncer.destroy()
    }
  }, [])
  
  const announce = useCallback((message: string, priority?: 'polite' | 'assertive') => {
    ScreenReaderAnnouncer.announce(message, priority)
  }, [])
  
  return { announce }
}

// ARIA labels for interview states
export const ARIA_LABELS = {
  connecting: 'Connecting to interview room',
  connected: 'Connected to interview',
  waiting: 'Waiting for AI interviewer to join',
  speaking: 'You are speaking',
  listening: 'AI interviewer is speaking',
  muted: 'Your microphone is muted',
  unmuted: 'Your microphone is unmuted',
  error: 'An error has occurred',
  ended: 'Interview has ended'
}

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  toggleMute: { key: 'm', modifier: null as const, description: 'Toggle microphone' },
  endInterview: { key: 'e', modifier: 'ctrl' as const, description: 'End interview' },
  help: { key: '?', modifier: null as const, description: 'Show keyboard shortcuts' },
  focusControls: { key: 'c', modifier: 'alt' as const, description: 'Focus on controls' }
}