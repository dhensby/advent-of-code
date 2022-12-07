module.exports = (data) => {
  // Data parsing!
  // The idea here is we will run through each line looking at either if it's
  // a command (starts with `$`) or if it's a directory (starts with `dir`)
  // or a file (anything else - a bit lazy, but still...).
  // We then start collecting the values into objects that represent directories and files
  const directoryStack = [];
  let currentDir = null;
  for (let i = 0; i < data.length; i += 1) {
    // split the data at spaces - each part of the command or output
    const input = data[i].split(' ');
    switch (input[0]) {
      // command
      case '$':
        // cd command is only one we care about, ls is actually a bit useless in our rigid context
        // we could use it to turn collection on/off, but we don't need to do that
        if (input[1] === 'cd') {
          // going up a dir, so we set our currentDir var to the "parent"
          // (which we've pushed into our stack)
          if (input[2] === '..') {
            currentDir = directoryStack.pop();
          } else {
            // the ls command will have listed directories for us, so we try to find it
            // if it doesn't exist (ie: this is the first 'cd' command we've seed) then
            // create a new one
            const newDir = currentDir?.files.find(({ name, type }) => type === 'dir' && name === input[2]) ?? {
              name: input[2],
              type: 'dir',
              files: [],
              get size() {
                return this.files.reduce((sum, next) => sum + next.size, 0);
              },
            };
            // if there's a dir defined, push it into our stack
            if (currentDir) {
              directoryStack.push(currentDir);
            }
            // reassign our currentDir context
            currentDir = newDir;
          }
        }
        break;
      case 'dir':
        // push a new directory object
        currentDir.files.push({
          name: input[1],
          type: 'dir',
          files: [],
          // note that we create a dynamic property on the object that will
          // just sum the sizes of all the files it holds
          get size() {
            return this.files.reduce((sum, next) => sum + next.size, 0);
          },
        });
        break;
      default:
        // push a file in!
        currentDir.files.push({
          name: input[1],
          type: 'file',
          // note size is a static property on files
          size: parseInt(input[0], 10),
        });
    }
  }
  // the root directory is the only item left in the stack
  const [dirListing] = directoryStack;
  const folders = [...directoryStack];
  // iterate recursively through all the folders, only summing the ones with a size below
  // our threshold.
  // NB: this also creates a list of all our directories - this will be helpful later ;)
  let sum = 0;
  for (let i = 0; i < folders.length; i += 1) {
    const folder = folders[i];
    // this check isn't strictly necessary, but we'll use it anyway
    if (folder.type === 'dir') {
      // push in all the nested folders
      folders.push(...folder.files.filter(({ type }) => type === 'dir'));
      // if the `size` is below our threshold, we'll add it to our sum
      if (folder.size <= 100000) {
        sum += folder.size;
      }
    }
  }
  // part 2 - find the smallest dir to delete to free the requisite space for the update
  const diskSize = 70000000;
  const requiredSpace = 30000000;
  const freeSpace = diskSize - dirListing.size;
  const spaceToFree = requiredSpace - freeSpace;
  // we sort our folders by descending size, this allows us to quickly find the smallest one
  folders.sort(({ size: aSize }, { size: bSize }) => aSize - bSize);
  return {
    part1: sum,
    // find the first item that is just big enough to free enough space and return its size
    part2: folders.find(({ size }) => size >= spaceToFree).size,
  };
};
