const calcHeightCache = {};
const calcScalerCache = {};
const calcBaseHeightCache = {};

export function calcScaler(minValue, maxValue, fromZero) {
  const argString = `${minValue}${maxValue}${fromZero}`;
  let result;
  if (calcScalerCache[argString]) {
    return calcScalerCache[argString];
  }
  if (fromZero) {
    result = Math.max(maxValue, 0) - Math.min(minValue, 0) || 1;
    calcScalerCache[argString] = result;
    return result;
  } else {
    result = maxValue - minValue || 1;
    calcScalerCache[argString] = result;
    return result;
  }
}

export function calcBaseHeight(minValue, maxValue, height, fromZero) {
  const argString = `${minValue}${maxValue}${height}${fromZero}`;
  let result;
  if (calcBaseHeightCache[argString]) {
    return calcBaseHeightCache[argString];
  }
  if (minValue >= 0 && maxValue >= 0) {
    result = height;
    calcBaseHeightCache[argString] = result;
    return result;
  } else if (minValue < 0 && maxValue <= 0) {
    result = 0;
    calcBaseHeightCache[argString] = result;
    return result;
  } else if (minValue < 0 && maxValue > 0) {
    result = (height * maxValue) / calcScaler(minValue, maxValue, fromZero);
    calcBaseHeightCache[argString] = result;
    return result;
  }
}

export function calcHeight(val, height, minValue, maxValue, fromZero) {
  const argString = `${val}${height}${minValue}${maxValue}${fromZero}`;
  let result;
  if (calcHeightCache[argString]) {
    return calcHeightCache[argString];
  }
  if (minValue < 0 && maxValue > 0) {
    result = height * (val / calcScaler(minValue, maxValue, fromZero));
    calcHeightCache[argString] = result;
    return result;
  } else if (minValue >= 0 && maxValue >= 0) {
    result = fromZero
      ? height * (val / calcScaler(minValue, maxValue, fromZero))
      : height * ((val - minValue) / calcScaler(minValue, maxValue, fromZero));
    calcHeightCache[argString] = result;
    return result;
  } else if (minValue < 0 && maxValue <= 0) {
    result = fromZero
      ? height * (val / calcScaler(minValue, maxValue, fromZero))
      : height * ((val - maxValue) / calcScaler(minValue, maxValue, fromZero));
    calcHeightCache[argString] = result;
    return result;
  }
}
