module.exports = (data) => {
    const [part1, part2] = data.reduce(([overlap, encompass], pair) => {
        // clean the data into start/end pairs of ints, each pair ordered by the interval length
        const [first, second] = pair.split(',').map((pair) => {
            return pair.split('-').map((v) => parseInt(v, 10));
        }).sort((a, b) => {
            return (a[1] - a[0]) - (b[1] - b[0]);
        });
        // first is shortest in length so can only be encompassed by second
        if (first[0] >= second[0] && first[1] <= second[1]) {
            encompass++;
            overlap++;
        } else if (first[0] >= second[0] && first[0] <= second[1] || first[1] >= second[0] && first[1] <= second[1]) {
            overlap++;
        }
        return [overlap, encompass];
    }, [0, 0]);
    return {
        part1,
        part2,
    };
};
