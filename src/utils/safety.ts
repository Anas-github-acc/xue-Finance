export function safetyCheck(input: string): boolean {
  const prohibitedKeywords = ['hack', 'exploit', 'illegal'];
  return !prohibitedKeywords.some(keyword => input.toLowerCase().includes(keyword));
}