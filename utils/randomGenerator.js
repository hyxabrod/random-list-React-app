
const adjectives = [
  'Beautiful', 'Fast', 'Bright', 'Quiet', 'Loud',
  'Amazing', 'Strange', 'Magical', 'Dark', 'Light',
  'Cold', 'Warm', 'Big', 'Small', 'High',
  'Low', 'Old', 'New', 'Kind', 'Angry'
];

const nouns = [
  'cat', 'dog', 'house', 'city', 'world',
  'ocean', 'forest', 'mountain', 'river', 'star',
  'moon', 'sun', 'tree', 'flower', 'bird',
  'fish', 'ship', 'plane', 'car', 'bike'
];

const sentenceParts = [
  'once decided to go on a journey',
  'found a mysterious artifact',
  'met an old friend',
  'opened a secret door',
  'heard a strange sound',
  'saw an unusual phenomenon',
  'felt excitement',
  'started a new adventure',
  'discovered a hidden treasure',
  'realized a deep truth',
  'created something amazing',
  'changed their life',
  'reached new heights',
  'overcame all obstacles',
  'found their purpose'
];

export const generateRandomTitle = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun}`;
};

export const generateRandomSentence = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const part = sentenceParts[Math.floor(Math.random() * sentenceParts.length)];
  return `${adj} ${noun} ${part}.`;
};

export const generateRandomText = (sentencesCount = 10) => {
  const sentences = [];
  for (let i = 0; i < sentencesCount; i++) {
    sentences.push(generateRandomSentence());
  }
  return sentences.join(' ');
};

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
