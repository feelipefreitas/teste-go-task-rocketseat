export const generateUniqueIdWithTimestamp = (): string => {
    const timestamp = new Date().getTime().toString(36); // Convert current timestamp to base 36
    const randomPart = Math.random().toString(36).substring(2, 9); // Shorter random part
    return `${timestamp}-${randomPart}`;
}