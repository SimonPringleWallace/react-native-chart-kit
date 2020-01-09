import React from "react";
import { Polyline, Path } from "react-native-svg";
import { calcBaseHeight, calcHeight } from "../chart-utils";

export const DataLine = props => {
  const {
    width,
    height,
    paddingRight,
    paddingTop,
    minDatasetValue,
    maxDatasetValue
  } = props.config;
  const renderLine = () => {
    const baseHeight = calcBaseHeight(
      minDatasetValue,
      maxDatasetValue,
      height,
      props.fromZero
    );
    return props.data.map((dataset, index) => {
      const points = dataset.data.map((d, i) => {
        const x =
          (i * (width - paddingRight)) / dataset.data.length + paddingRight;
        const y =
          ((baseHeight -
            calcHeight(d, height, minDatasetValue, maxDatasetValue)) /
            4) *
            3 +
          paddingTop;
        return `${x},${y}`;
      });

      return (
        <Polyline
          key={index}
          points={points.join(" ")}
          fill="none"
          stroke={props.getColor(dataset, 0.2)}
          strokeWidth={props.getStrokeWidth(dataset)}
        />
      );
    });
  };

  const renderBezierLine = () => {
    return props.data.map((dataset, index) => {
      const result = props.getBezierLinePoints(dataset, props.config);
      return (
        <Path
          key={index}
          d={result}
          fill="none"
          stroke={props.getColor(dataset, 0.2)}
          strokeWidth={props.getStrokeWidth(dataset)}
        />
      );
    });
  };
  return props.bezier ? renderBezierLine() : renderLine();
};
