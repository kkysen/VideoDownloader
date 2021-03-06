import {ReactNode} from "react";

export const capitalize = function(word: string): string {
    return word.length === 0
        ? ""
        : word[0].toUpperCase() + word.slice(1);
};

export const joinWords = function(words: ReadonlyArray<string>): string {
    const _words: string[] = [...words];
    switch (_words.length) {
        case 0:
            return "";
        case 1:
            return _words[0];
        case 2:
            return _words[0] + " and " + _words[1];
        default:
            const lastWord: string = _words.pop() as string;
            return _words.join(", ") + ", and " + lastWord;
    }
};

export const camelCase = (() => {
    // from react-faux-dom/lib/utils/camelCase.js
    const hyphenPattern = /-+([a-z])/gi;
    return function(s: string): string {
        hyphenPattern.lastIndex = 0;
        return s.replace(hyphenPattern, (match: string, c: string, offset: number) => {
            return offset === 0 ? c : c.toUpperCase();
        });
    }
})();

export const separateClassName = function(className: string): string {
    return className.replace(/([A-Z])/g, " $1").trim();
};

export const separateFunctionName = function(functionName: string): string {
    const [first, ...rest] = separateClassName(functionName).split(" ");
    return [capitalize(first), ...rest].join(" ");
};

export const joinNodes = function(nodes: ReactNode[], node: ReactNode): ReactNode[] {
    if (nodes.length < 2) {
        return nodes;
    }
    const joinedNodes: ReactNode[] = [];
    for (let i = 0, j = 0; i < nodes.length; i++) {
        joinedNodes.push(nodes[i]);
        joinedNodes.push(node && node.shallowClone());
    }
    joinedNodes.pop();
    return joinedNodes;
};

export const singletonAsArray = function <T>(singletonOrArray: T | T[]) {
    return Array.isArray(singletonOrArray) ? singletonOrArray : [singletonOrArray];
};

export const filterInput = function(input: HTMLInputElement, charFilter: (c: string) => boolean): void {
    input.value = input.value.split("").filter(charFilter).join("");
};

/**
 * Check if a single character string is a allowDigits.
 *
 * @param {string} char a single character string
 * @returns {boolean} if the character is a allowDigits 0-9
 */
export const isDigit = function(char: string): boolean {
    return !Number.isNaN(parseInt(char));
};

export const onlyDigitsInput = function(input: HTMLInputElement): void {
    filterInput(input, isDigit);
};

export const sleep = function(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

const regExpLiteralPattern = /\/([^\/]+)\/([gimuy]*)/;

export const isRegExpLiteral = function(regex: string): boolean {
    return regExpLiteralPattern.test(regex);
};

export const parseRegExpLiteral = function(regex: string): RegExp | undefined {
    const match = regExpLiteralPattern.exec(regex);
    if (match) {
        const [, pattern, flags] = match;
        return new RegExp(pattern, flags);
    } else {
        return undefined;
    }
};

export const escapeRegExp = function(literal: string, flags?: string): RegExp {
    return new RegExp(
        literal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
        flags,
    );
};

export class NotImplementedError extends Error {

}

export const lowerBound = function(min: number, n: number): number {
    return Math.max(min, n);
};

export const upperBound = function(max: number, n: number): number {
    return Math.min(max, n);
};

export const bound = function(min: number, max: number, n: number): number {
    return lowerBound(min, upperBound(max, n));
};

export const boundSurrounding = function(min: number, max: number, center: number, halfSize: number): [number, number] {
    return [lowerBound(min, center - halfSize), upperBound(max, center + halfSize)];
};

export const snippet = function(s: string, center: number, halfSize: number): string {
    const [start, end] = boundSurrounding(0, s.length, center, halfSize);
    return s.slice(start, end);
};

export const boolAsInt = function(bool: boolean): 0 | 1 {
    return bool ? 1 : 0;
};

export const moduloIndexer = function <T>(a: ReadonlyArray<T>): (i: number) => T {
    return i => a[i % a.length];
};

/**
 * Make an array non-holey.
 *
 * @param {T[]} a holey array
 * @returns {T[]} a blasphemous array
 */
export const makeBlasphemous = function<T>(a: T[]): T[] {
    return Object.values(a) as any as T[];
};