export function generateDeviceId(): string {
    return Array.from(Array(16), () => Math.floor(Math.random() * 36).toString(36)).join('');
}