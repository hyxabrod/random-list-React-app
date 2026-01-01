
export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export function generateRandomTitle(): string {
    const adjectives = [
        'Efficient', 'Significant', 'Potential', 'Accurate', 'Complex', 'Global',
        'Initial', 'Logical', 'Practical', 'Intense', 'Frequent', 'Creative',
        'Typical', 'Visible', 'Mental', 'Current', 'Digital', 'External'
    ];
    const nouns = [
        'Concept', 'Approach', 'Feature', 'Method', 'Outcome', 'Resource',
        'Structure', 'Theory', 'Benefit', 'Context', 'Element', 'Factor',
        'Impact', 'Region', 'Source', 'Status', 'Symbol', 'Target'
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
}

export function generateRandomText(sentences: number): string {
    const words = [
        'achieve', 'acquire', 'analyze', 'aspect', 'assist', 'category', 'chapter',
        'complex', 'conclude', 'conduct', 'consumer', 'credit', 'culture', 'design',
        'distinct', 'element', 'equate', 'evaluate', 'feature', 'final', 'focus',
        'impact', 'injure', 'institute', 'invest', 'item', 'journal', 'maintain',
        'normal', 'obtain', 'participate', 'perceive', 'positive', 'potential',
        'previous', 'primary', 'purchase', 'range', 'region', 'regulate', 'relevant',
        'reside', 'resource', 'restrict', 'secure', 'seek', 'select', 'site',
        'strategy', 'survey', 'text', 'tradition', 'transfer'
    ];
    let text = '';
    for (let i = 0; i < sentences; i++) {
        let sentence = '';
        const length = 5 + Math.floor(Math.random() * 10);
        for (let j = 0; j < length; j++) {
            sentence += words[Math.floor(Math.random() * words.length)] + ' ';
        }
        text += sentence.trim() + '. ';
    }
    return text.trim();
}

export function generateRandomInt(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max - min + 1));
}
