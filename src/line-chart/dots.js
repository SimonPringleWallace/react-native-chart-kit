import React from "react";
import { Circle } from "react-native-svg";
import { calcBaseHeight, calcHeight } from "./../chart-utils";

export const Dots = props => {
  const {
    width,
    height,
    paddingTop,
    paddingRight,
    onDataPointClick
  } = props.config;
  const baseHeight = calcBaseHeight(
    props.minDatasetValue,
    props.maxDatasetValue,
    height,
    props.fromZero
  );
  const { getDotColor, hidePointsAtIndex = [] } = props;

  return props.data.map((dataset, index) => {
    return (
      <DotSet
        key={index}
        dataset={dataset}
        hidePointsAtIndex={hidePointsAtIndex}
        dimensions={{ height, width, paddingRight, baseHeight, paddingTop }}
        minDatasetValue={props.minDatasetValue}
        maxDatasetValue={props.maxDatasetValue}
        onDataPointClick={onDataPointClick}
        getDotColor={getDotColor}
        getColor={props.getColor}
        fromZero={props.fromZero}
        getPropsForDots={props.getPropsForDots}
      />
    );
  });
};

const DotSet = props => {
  const output = [];
  const {
    width,
    paddingRight,
    baseHeight,
    paddingTop,
    height
  } = props.dimensions;
  const { hidePointsAtIndex, dataset } = props;

  dataset.data.forEach((x, i) => {
    if (hidePointsAtIndex.length && hidePointsAtIndex.includes(i)) {
      return;
    }
    const cx =
      paddingRight + (i * (width - paddingRight)) / dataset.data.length;
    const cy =
      ((baseHeight -
        calcHeight(
          x,
          height,
          props.minDatasetValue,
          props.maxDatasetValue,
          props.fromZero
        )) /
        4) *
        3 +
      paddingTop;

    const onPress = () => {
      if (!props.onDataPointClick || hidePointsAtIndex.includes(i)) {
        return;
      }
      props.onDataPointClick({
        index: i,
        value: x,
        dataset,
        x: cx,
        y: cy,
        getColor: opacity => props.getColor(dataset, opacity)
      });
    };
    output.push(
      <Circle
        key={i}
        cx={cx}
        cy={cy}
        fill={
          typeof getDotColor === "function"
            ? props.getDotColor(x, i)
            : props.getColor(dataset, 0.9)
        }
        onPress={onPress}
        {...props.getPropsForDots(x, i)}
      />,
      <Circle
        key={Number.MAX_SAFE_INTEGER - i}
        cx={cx}
        cy={cy}
        r="12"
        fill="#fff"
        fillOpacity={0}
        onPress={onPress}
      />
    );
  });
  return output;
};
