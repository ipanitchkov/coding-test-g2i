function hasEnoughSpace(orderedIndexes: number[], totalNumOfItems: number): boolean {
    if (orderedIndexes[0] > 1 || orderedIndexes[orderedIndexes.length - 1] < totalNumOfItems - 2) {
        return true;
    }
    for (let i: number = 1; i < orderedIndexes.length; i++) {
        const currentDifference: number = orderedIndexes[i] - orderedIndexes[i - 1];

        if (currentDifference > 3) {
            return true;
        }
    }
    return false;
}

function sortAscending(a: number, b: number): number {
    return a - b;
}

export const getRandomIndexes = (numOfItems: number, totalNumOfItems: number) => {
    const resultSet = new Set;

    while (resultSet.size < numOfItems) {
        const index: number = Math.floor(Math.random() * totalNumOfItems);

        if (!resultSet.has(index - 1) && !resultSet.has(index) && !resultSet.has(index + 1)) {
            resultSet.add(index);
        } else {
            const orderedIndexes: any[] = [...resultSet.keys()].sort(sortAscending);

            if (!hasEnoughSpace(orderedIndexes, totalNumOfItems)) {
                return [...resultSet.keys()];
            }
        }
    }

    return [...resultSet.keys()];
}
