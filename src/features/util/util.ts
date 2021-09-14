import { nanoid } from "@reduxjs/toolkit";

export const reorder = <T extends unknown>(list: Array<T> | undefined, startIndex: number, endIndex: number) => {
    if (!list) return;
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function lastElement<T>(array: T[] | undefined) {
    if (!array) return undefined;
    return array.length ? array[array.length - 1] : undefined;
}

const immediateIntervals: {
    [token: string]: boolean
} = {};

export function setImmediateInterval(callback: () => void, interval: number, token?: string) {
    if (!token) token = nanoid();
    immediateIntervals[token] = true;
    const wrappedCallback = (token: string) => {
        if (!immediateIntervals[token]) return;
        callback();
        setTimeout(() => wrappedCallback(token), interval);
    };
    wrappedCallback(token);
    return token;
}

export function cancelImmediateIntercal(token: string) {
    immediateIntervals[token] = false;
}
