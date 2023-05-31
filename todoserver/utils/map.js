let map = new Map();

//singelton map
 const getMap = (data,again) => {
  if (map.size !==0 && again==false) {
    console.log(1)
    return map;
  } else {
    console.log(2)

    let internalMap = new Map();

    for (let index = 0; index < data.length; index++) {
      const task = data[index];
      const taskIndex = index;
      const taskName = task.name;

      taskName.split(" ").forEach((word) => {
        if (internalMap.has(word.toLowerCase())) {
            internalMap.get(word.toLowerCase()).push(taskIndex);
        } else {
            internalMap.set(word.toLowerCase(), [taskIndex]);
        }
      });
    }
    map=internalMap;
    return map;
  }
};

module.exports = {getMap};