import React from "react";
import { Line } from "react-native-svg";

export const HorizontalLines = props => {
  const { height, paddingTop } = props;
  return [...new Array(props.count)].map((_, i) => {
    return (
      <Line
        key={i}
        x1={props.paddingRight}
        y1={(height / 4) * i + paddingTop}
        x2={props.width}
        y2={(height / 4) * i + paddingTop}
        {...props.backgroundLineProps}
      />
    );
  });
};
