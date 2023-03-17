const decodeFilterCountRoom = (hint, vl) => {
  if (vl === "ALL") {
    return {};
  } else if (vl === "MAX") {
    return {
      [hint]: { $gte: 8 },
    };
  }
  return {
    [hint]: vl,
  };
};

module.exports = { decodeFilterCountRoom };
