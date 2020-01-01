import React from "react";
import { Line } from "react-native-svg";

export const VerticalLines = props => {
  const { height, paddingTop, paddingRight, backgroundLineProps } = props;

  if (props.data) {
    const { data, width } = props;
    return [...new Array(data.length)].map((_, i) => {
      return (
        <Line
          key={i}
          x1={Math.floor(
            ((width - paddingRight) / data.length) * i + paddingRight
          )}
          y1={0}
          x2={Math.floor(
            ((width - paddingRight) / data.length) * i + paddingRight
          )}
          y2={height - height / 4 + paddingTop}
          {...backgroundLineProps}
        />
      );
    });
  } else {
    return (
      <Line
        x1={Math.floor(paddingRight)}
        y1={0}
        x2={Math.floor(paddingRight)}
        y2={height - height / 4 + paddingTop}
        {...backgroundLineProps}
      />
    );
  }
};
