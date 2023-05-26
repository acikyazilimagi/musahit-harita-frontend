export const intensityColorSelector = (item: string) => {
  switch (item) {
    case "1":
      return "#FAF7BF";
    case "2":
      return "#FCD73F";
    case "3":
      return "#FDAE33";
    case "4":
      return "#FE8427";
    case "5":
      return "#FE591D";
    default:
      return "#EB2032";
  }
};

export const intensityTextColorSelector = (item: string) => {
  switch (item) {
    case "1":
      return "#000000";
    case "2":
      return "#000000";
    case "3":
      return "#000000";
    case "4":
      return "#ffffff";
    case "5":
      return "#ffffff";
    default:
      return "#ffffff";
  }
};

export const intensityTextSelector = (item: string) => {
  switch (item) {
    case "1":
      return "low";
    case "2":
      return "midLow";
    case "3":
      return "mid";
    case "4":
      return "midHigh";
    case "5":
      return "high";
    default:
      return "mid";
  }
};
