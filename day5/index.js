const { loadDaysInput } = require('../utils');

function lineOnPoint(start, end, {x, y}) {
    const dxc = x - start.x;
    const dyc = y - start.y;
    const dxl = end.x - start.x;
    const dyl = end.y - start.y;
    // on the same line, but need to check if between the points
    if (((dxc * dyl) - (dyc * dxl)) === 0) {
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ?
                start.x <= x && x <= end.x :
                end.x <= x && x <= start.x;
        }
        return dyl > 0 ?
            start.y <= y && y <= end.y :
            end.y <= y && y <= start.y;
    }
    return false;
}

(async () => {
    const input = await loadDaysInput(__dirname);
    const lines =  input.map((line) => {
        const [startPoint, endPoint] = line.split(' -> ');
        const start = startPoint.split(',');
        const end = endPoint.split(',');
        return [{
            x: start[0],
            y: start[1],
        }, {
            x: end[0],
            y: end[1],
        }];
    });
    const [maxX, maxY] = lines.reduce((maximums, nextLine) => {
        return [Math.max(maximums[0], nextLine[0].x, nextLine[1].x), Math.max(maximums[1], nextLine[0].y, nextLine[1].y)];
    }, [0, 0]);
    console.time('part1');
    // nb: this is super inefficient, better to iterate through the lines and check if they intersect and, if so, at which point(s)
    // iterate through the conceptual plain and check if each of the points in that plain lie on any of the lines
    // if the point lies on two or more of the lines, count it
    let points = [];
    for (let i = 0; i < (maxX + 1) * (maxY + 1); i++) {
        // int to point
        const x = i % (maxX + 1);
        const y = Math.floor(i / (maxX +1));
        const linesThroughPoint = lines.filter(([start, end]) => {
            return (start.x === end.x || start.y === end.y) && lineOnPoint(start, end, {x,y});
        });
        // if (i % (maxX + 1) === 0) {
        //     process.stdout.write('\n');
        // }
        // process.stdout.write(linesThroughPoint.length === 0 ? '.' : linesThroughPoint.length.toString());
        if (linesThroughPoint.length >= 2) {
            points.push({x, y});
        }
    }
    // process.stdout.write('\n');
    console.timeEnd('part1');
    console.log('Part 1:', points.length);

    console.time('part2');
    // iterate through the conceptual plain and check if each of the points in that plain lie on any of the lines
    // if the point lies on two or more of the lines, count it
    points = [];
    for (let i = 0; i < (maxX + 1) * (maxY + 1); i++) {
        // int to point
        const x = i % (maxX + 1);
        const y = Math.floor(i / (maxX +1));
        const linesThroughPoint = lines.filter(([start, end]) => {
            return lineOnPoint(start, end, {x,y});
        });
        // if (i % (maxX + 1) === 0) {
        //     process.stdout.write('\n');
        // }
        // process.stdout.write(linesThroughPoint.length === 0 ? '.' : linesThroughPoint.length.toString());
        if (linesThroughPoint.length >= 2) {
            points.push({x, y});
        }
    }
    // process.stdout.write('\n');
    console.timeEnd('part2');
    console.log('Part 2:', points.length);
})().catch(console.error);
