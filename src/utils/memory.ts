export class Memory {
  private mmyStore: { role: string; content: string}[] = [];

  remember(interaction: {role: string; content: string}) {
    this.mmyStore.push(interaction);
  }
  
  recall() {
    return this.mmyStore.map(m => `${m.role}: ${m.content}`).join('\n');
  };

  clear() {
    this.mmyStore = [];
  }
}