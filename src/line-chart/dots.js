import React from "react";
import { Circle } from "react-native-svg";

// props:
// renderDots = config => {

export const Dots = props => {
  const {
    width,
    height,
    paddingTop,
    paddingRight,
    onDataPointClick
  } = props.config;
  const output = [];
  const baseHeight = props.calcBaseHeight(props.datas, height);
  const { getDotColor, hidePointsAtIndex = [] } = props;

  props.data.forEach(dataset => {
    dataset.data.forEach((x, i) => {
      if (hidePointsAtIndex.length && hidePointsAtIndex.includes(i)) {
        return;
      }
      const cx =
        paddingRight + (i * (width - paddingRight)) / dataset.data.length;
      const cy =
        ((baseHeight - props.calcHeight(x, props.datas, height)) / 4) * 3 +
        paddingTop;

      const onPress = () => {
        if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
          return;
        }
        onDataPointClick({
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
              ? getDotColor(x, i)
              : props.getColor(dataset, 0.9)
          }
          onPress={onPress}
          {...props.getPropsForDots(x, i)}
        />,
        <Circle
          key={i + 1000}
          cx={cx}
          cy={cy}
          r="12"
          fill="#fff"
          fillOpacity={0}
          onPress={onPress}
        />
      );
    });
  });
  return output;
};
