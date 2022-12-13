// this converts a point's char to an int value
function pointToVal(point) {
  let interpreted = point;
  if (point === 'S') {
    interpreted = 'a';
  } else if (point === 'E') {
    interpreted = 'z';
  }
  return interpreted.charCodeAt(0);
}

// an simplified implementation of Dijkstra's algorithm
// for finding the shortest paths between points
// given a graph of the map, and start and end points,
// we calculate a set of steps required to get from start to finish
function shortestPathsBetween(graph, start, end) {
  // create a Set to record visited points and points yet to be visited
  // using a set helps reduce the iterations as it automatically keeps the
  // lists unique, preventing double visits or bespoke logic to prevent them
  const visited = new Set();
  const unvisited = new Set([start]);
  // our map of closest neighbours for a given point [point] => [closestPoint, distance]
  const shortestDistances = [];
  // set the initial start position's shortest distance to itself
  shortestDistances[start] = [start, 0];
  // iterate over every unvisited point in the set
  // this will keep going if we push new values in during the loop
  unvisited.forEach((current) => {
    // find all eligible neighbours to check (ie: any we haven't visited before)
    const neighbours = Object.keys(graph[current])
      .map((key) => parseInt(key, 10))
      .filter((point) => !visited.has(point));
    // all neighbours are the same distance away,
    // so we can primitively calculate the distance to the next neighbour
    const distanceToNext = shortestDistances[current][1] + 1;

    // iterate over all the neighbours, adding them to our unvisited set
    // and determining if they are the closest neighbour we are yet to see
    for (let i = 0; i < neighbours.length; i += 1) {
      unvisited.add(neighbours[i]);
      const currentDistance = shortestDistances[neighbours[i]]?.[1];
      if (currentDistance === undefined || distanceToNext < currentDistance) {
        shortestDistances[neighbours[i]] = [current, distanceToNext];
      }
    }
    // mark this point as visited so we don't visit it again
    visited.add(parseInt(current, 10));
  });

  // now we have calculated the nearest neighbour for each point,
  // we can work out the path to take. We start that backwards.
  // going from the end, following the shortest path until we reach
  // the target start point
  const path = [];
  let next = end;
  do {
    // add the next point to the path
    path.unshift(next);
    // no possible path - we've reached a dead end
    if (!shortestDistances[next]) {
      return null;
    }
    // reassign next and continue iterating
    [next] = shortestDistances[next];
  } while (next !== start);
  // return the optimal path - note this path doesn't include
  // the start point
  return path;
}

module.exports = (data) => {
  const graph = [];
  const potentialStarts = [];
  let start = null;
  let end = null;
  for (let i = 0; i < data.length; i += 1) {
    for (let j = 0; j < data[i].length; j += 1) {
      const index = (i * data[i].length) + j;
      const currentValue = pointToVal(data[i][j]);
      if (data[i][j] === 'S') {
        potentialStarts.push(index);
        start = index;
      } else if (data[i][j] === 'E') {
        end = index;
      }
      const possibleNeighbors = [
        [j, i - 1], // up
        [j + 1, i], // right
        [j, i + 1], // down
        [j - 1, i], // left
      ].filter(([x, y]) => {
        const point = data[y]?.[x];
        return point && pointToVal(point) <= currentValue + 1;
      });
      if (possibleNeighbors.length && data[i][j] === 'a') {
        potentialStarts.push(index);
      }
      graph[index] = possibleNeighbors.reduce((neighbours, [x, y]) => ({
        ...neighbours,
        [(y * data[y].length) + x]: 1,
      }), {});
    }
  }
  return {
    part1: shortestPathsBetween(graph, start, end).length,
    part2: potentialStarts.reduce((shortest, next) => {
      const path = shortestPathsBetween(graph, next, end);
      if (!path) {
        return shortest;
      }
      return path.length < shortest ? path.length : shortest;
    }, Infinity),
  };
};
