export function calcScaler(minValue, maxValue, fromZero) {
  if (fromZero) {
    return Math.max(maxValue, 0) - Math.min(minValue, 0) || 1;
  } else {
    return maxValue - minValue || 1;
  }
}

export function calcBaseHeight(minValue, maxValue, height, fromZero) {
  if (minValue >= 0 && maxValue >= 0) {
    return height;
  } else if (minValue < 0 && maxValue <= 0) {
    return 0;
  } else if (minValue < 0 && maxValue > 0) {
    return (height * maxValue) / calcScaler(minValue, maxValue, fromZero);
  }
}

export function calcHeight(val, height, minValue, maxValue, fromZero) {
  if (minValue < 0 && maxValue > 0) {
    return height * (val / calcScaler(minValue, maxValue, fromZero));
  } else if (minValue >= 0 && maxValue >= 0) {
    return fromZero
      ? height * (val / calcScaler(minValue, maxValue, fromZero))
      : height * ((val - minValue) / calcScaler(minValue, maxValue, fromZero));
  } else if (minValue < 0 && maxValue <= 0) {
    return fromZero
      ? height * (val / calcScaler(minValue, maxValue, fromZero))
      : height * ((val - maxValue) / calcScaler(minValue, maxValue, fromZero));
  }
}
