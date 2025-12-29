
export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

export function generateRandomTitle(): string {
    const adjectives = ['Awesome', 'Shiny', 'Rust', 'Golden', 'Silver', 'Bronze', 'Crystal', 'Hidden'];
    const nouns = ['Sword', 'Shield', 'Potion', 'Scroll', 'Amulet', 'Ring', 'Gem', 'Key'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun}`;
}

export function generateRandomText(sentences: number): string {
    const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
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
