export function isURL(str: string): boolean {
    if (!str.toLowerCase().includes("http")) return false

    try {
        // Use the URL constructor which is more reliable
        const url = new URL(str)
        return ["http:", "https:"].includes(url.protocol)
    } catch (e) {
        return false
    }
}
