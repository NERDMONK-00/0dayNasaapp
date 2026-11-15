import type { DataSource, VitalReading } from '../types'

/**
 * HardwareSource is intentionally left as a stub for future integration.
 *
 * Planned implementation:
 * - WebSocket connection to a local edge device
 * - Web Serial / Web Bluetooth when supported by the browser
 * - Optional translation layer from sensor payloads into VitalReading
 *
 * The important part is that this class will implement the same DataSource
 * contract, so the rest of the app remains unchanged.
 */
export class HardwareSource implements DataSource {
  subscribe(callback: (reading: VitalReading) => void): () => void {
    void callback

    // Placeholder for real sensor integration.
    return () => undefined
  }
}
