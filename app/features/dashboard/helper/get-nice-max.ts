export function getNiceMax(value: number) {
    if (value <= 10) {
        return 10;
    }

    const magnitude = Math.pow(
        10,
        Math.floor(Math.log10(value))
    );

    const normalized = value / magnitude;

    let rounded;

    if (normalized <= 2) {
        rounded = 2;
    } else if (normalized <= 5) {
        rounded = 5;
    } else {
        rounded = 10;
    }

    return rounded * magnitude;
}