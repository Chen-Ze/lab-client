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

export function lastElement<T>(array: T[]) {
    return array.length ? array[array.length - 1] : undefined;
}
