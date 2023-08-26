export async function delayTime(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
