const commonWords: string[] = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'great', 'between', 'need', 'large', 'under', 'never', 'each', 'much', 'begin',
    'life', 'where', 'every', 'still', 'last', 'long', 'world', 'very', 'through',
    'right', 'too', 'mean', 'old', 'why', 'help', 'put', 'different', 'away', 'again',
    'off', 'went', 'own', 'while', 'found', 'here', 'thing', 'many', 'place', 'small',
    'home', 'hand', 'high', 'keep', 'end', 'point', 'start', 'might', 'story', 'city',
    'head', 'far', 'run', 'set', 'important', 'big', 'move', 'night', 'country', 'school',
    'feet', 'eye', 'door', 'open', 'seem', 'next', 'walk', 'white', 'children', 'side',
    'car', 'water', 'young', 'face', 'house', 'group', 'always', 'name', 'should', 'study',
    'change', 'room', 'turn', 'play', 'learn', 'light', 'read', 'family', 'show', 'part',
    'number', 'ask', 'food', 'close', 'few', 'left', 'man', 'hard', 'line', 'woman',
    'letter', 'earth', 'mother', 'father', 'talk', 'real', 'money', 'book', 'power', 'voice',
    'love', 'music', 'mind', 'table', 'member', 'picture', 'watch', 'together', 'follow',
    'around', 'animal', 'list', 'miss', 'friend', 'idea', 'late', 'morning', 'air', 'grow',
    'above', 'often', 'enough', 'both', 'paper', 'hear', 'question', 'during', 'hundred',
    'reach', 'answer', 'across', 'south', 'north', 'toward', 'king', 'ground', 'body',
    'stand', 'form', 'class', 'field', 'plan', 'sure', 'done', 'river', 'half', 'problem',
    'minute', 'strong', 'state', 'piece', 'best', 'since', 'second', 'order', 'fall', 'front',
    'against', 'example', 'among', 'dark', 'ball', 'bring', 'short', 'perhaps', 'fish',
    'area', 'mark', 'fire', 'nothing', 'hold', 'care', 'road', 'able', 'less',
    'early', 'age', 'horse', 'fine', 'pair', 'carry', 'special', 'certain', 'space',
    'clear', 'wood', 'warm', 'common', 'cold', 'result', 'remember', 'cost', 'build',
    'fast', 'level', 'check', 'system', 'free', 'green', 'stop', 'language', 'happen',
    'interest', 'market', 'material', 'record', 'support', 'believe', 'report', 'season',
    'complete', 'direct', 'product', 'street', 'value', 'service', 'measure', 'travel',
    'science', 'nature', 'modern', 'center', 'color', 'cover', 'surface', 'island',
    'create', 'produce', 'office', 'simple', 'course', 'figure', 'plant', 'design',
    'prepare', 'notice', 'practice', 'explain', 'develop', 'accept', 'provide', 'suggest',
    'consider', 'include', 'require', 'continue', 'describe', 'determine', 'position',
    'possible', 'thousand', 'similar', 'appear', 'society', 'several', 'purpose',
    'express', 'realize', 'various', 'either', 'moment', 'contain', 'present', 'future',
    'receive', 'general', 'natural', 'discover', 'surprise', 'necessary', 'subject',
    'community', 'imagine', 'personal', 'represent', 'industry', 'experience', 'expect',
    'within', 'rather', 'remain', 'itself', 'sense', 'public', 'pressure', 'season',
    'pretty', 'company', 'effect', 'enjoy', 'exist', 'remove', 'single', 'force',
    'matter', 'pattern', 'return', 'program', 'current', 'involve', 'process'
];

const punctuation = ['.', ',', '!', '?', ';', ':'];

function getRandomWord(): string {
    return commonWords[Math.floor(Math.random() * commonWords.length)];
}

function shouldApply(chance: number): boolean {
    return Math.random() < chance;
}

function capitalizeFirst(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function generateText(
    wordCount: number,
    options: { punctuation: boolean; numbers: boolean }
): string {
    const words: string[] = [];

    for (let i = 0; i < wordCount; i++) {
        let word = getRandomWord();

        // Capitalize word after sentence-ending punctuation
        if (
            words.length > 0 &&
            options.punctuation
        ) {
            const prevWord = words[words.length - 1];
            const lastChar = prevWord[prevWord.length - 1];
            if (['.', '!', '?'].includes(lastChar)) {
                word = capitalizeFirst(word);
            }
        }

        // Insert a number occasionally
        if (options.numbers && shouldApply(0.08) && i > 0) {
            words.push(String(Math.floor(Math.random() * 1000)));
        }

        // Add punctuation to end of word
        if (options.punctuation && shouldApply(0.15) && i > 0 && i < wordCount - 1) {
            word += punctuation[Math.floor(Math.random() * punctuation.length)];
        }

        words.push(word);
    }

    // Ensure last word ends with a period if punctuation is on
    if (options.punctuation && words.length > 0) {
        const last = words[words.length - 1];
        const lastChar = last[last.length - 1];
        if (!punctuation.includes(lastChar)) {
            words[words.length - 1] = last + '.';
        }
    }

    return words.join(' ');
}

export function generateWordsArray(
    wordCount: number,
    options: { punctuation: boolean; numbers: boolean }
): string[] {
    const text = generateText(wordCount, options);
    return text.split(' ');
}
