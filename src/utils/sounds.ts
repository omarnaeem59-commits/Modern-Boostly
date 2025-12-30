/**
 * Plays a pleasant completion sound effect
 * Creates a "ting" or bell-like sound using Web Audio API
 */
export function playCompletionSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Create oscillator for the main tone
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // Connect nodes
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Set up the sound - a pleasant bell-like "ting"
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // Start frequency
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1) // Quick rise
    oscillator.type = 'sine' // Smooth sine wave
    
    // Envelope for a nice attack and decay
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01) // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3) // Decay
    
    // Play the sound
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
    
    // Clean up
    oscillator.onended = () => {
      audioContext.close()
    }
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug("Audio context not available:", error)
  }
}

/**
 * Plays a success sound - slightly different from completion
 * More celebratory tone
 */
export function playSuccessSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Create two oscillators for a richer sound
    const osc1 = audioContext.createOscillator()
    const osc2 = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // Connect both oscillators
    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // First oscillator - main tone
    osc1.frequency.setValueAtTime(600, audioContext.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.15)
    osc1.type = 'sine'
    
    // Second oscillator - harmony
    osc2.frequency.setValueAtTime(900, audioContext.currentTime)
    osc2.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.15)
    osc2.type = 'sine'
    
    // Envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
    
    // Play
    osc1.start(audioContext.currentTime)
    osc2.start(audioContext.currentTime)
    osc1.stop(audioContext.currentTime + 0.4)
    osc2.stop(audioContext.currentTime + 0.4)
    
    // Clean up
    osc1.onended = () => {
      audioContext.close()
    }
  } catch (error) {
    console.debug("Audio context not available:", error)
  }
}

