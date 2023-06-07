let map = new Map();

//singelton map
const getMap = (data, createAgain) => {
  if (map.size !== 0 && createAgain == false) {
    console.log("send map");
    return map;
  } else {
    console.log("create map");
    map = createNewMap(data);
    return map;
  }
};

module.exports = { getMap };

const createNewMap = (data) => {
  let internalMap = new Map();

  for (let i = 0; i < data.length; i++) {
    const task = data[i];
    const taskIndex = i;
    const taskName = task.name;

    taskName.split(" ").forEach((word) => {
      if (internalMap.has(word.toLowerCase())) {
        internalMap.get(word.toLowerCase()).push(taskIndex);
      } else {
        internalMap.set(word.toLowerCase(), [taskIndex]); // create new array with first index
      }
    });
  }
  return internalMap;
};
