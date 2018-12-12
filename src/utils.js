export const castDie = (max, min = 1) => {
    return Math.floor(min + Math.random() * max);
};
