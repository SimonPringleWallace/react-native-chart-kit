import React, { Component } from "react";
import { LinearGradient, Line, Text, Defs, Stop } from "react-native-svg";
import { HorizontalLines } from "./horizontal-lines";
import { calcScaler } from "./../chart-utils";
class AbstractChart extends Component {
  getPropsForBackgroundLines() {
    const { propsForBackgroundLines = {} } = this.props.chartConfig;
    return {
      stroke: this.props.chartConfig.color(0.2),
      strokeDasharray: "5, 10",
      strokeWidth: 1,
      ...propsForBackgroundLines
    };
  }

  getPropsForLabels() {
    const {
      propsForLabels = {},
      color,
      labelColor = color
    } = this.props.chartConfig;
    return {
      fontSize: 12,
      fill: labelColor(0.8),
      ...propsForLabels
    };
  }

  renderHorizontalLines = config => {
    return (
      <HorizontalLines
        {...config}
        backgroundLineProps={this.getPropsForBackgroundLines()}
      />
    );
  };

  renderHorizontalLine = config => {
    const { width, height, paddingTop, paddingRight } = config;
    return (
      <Line
        x1={paddingRight}
        y1={height - height / 4 + paddingTop}
        x2={width}
        y2={height - height / 4 + paddingTop}
        {...this.getPropsForBackgroundLines()}
      />
    );
  };

  renderHorizontalLabels = config => {
    const {
      count,
      data,
      height,
      paddingTop,
      paddingRight,
      horizontalLabelRotation = 0,
      formatYLabel = yLabel => yLabel
    } = config;
    const {
      yAxisLabel = "",
      yAxisSuffix = "",
      yLabelsOffset = 12,
      chartConfig
    } = this.props;
    const { decimalPlaces = 2 } = chartConfig;
    return [...new Array(count)].map((_, i) => {
      let yLabel;
      if (count === 1) {
        yLabel = `${yAxisLabel}${formatYLabel(
          data[0].toFixed(decimalPlaces)
        )}${yAxisSuffix}`;
      } else if (config.horizontalOverride) {
        yLabel = config.horizontalOverride[i];
      } else {
        const minDatasetValue = Math.min(...data);
        const maxDatasetValue = Math.max(...data);
        const label = this.props.fromZero
          ? (calcScaler(minDatasetValue, maxDatasetValue, true) / (count - 1)) *
              i +
            Math.min(minDatasetValue, 0)
          : (calcScaler(minDatasetValue, maxDatasetValue, false) /
              (count - 1)) *
              i +
            minDatasetValue;
        yLabel = `${yAxisLabel}${formatYLabel(
          label.toFixed(decimalPlaces)
        )}${yAxisSuffix}`;
      }

      const x = paddingRight - yLabelsOffset;
      const y =
        count === 1 && this.props.fromZero
          ? paddingTop + 4
          : (height * 3) / 4 - ((height - paddingTop) / count) * i + 12;
      return (
        <Text
          rotation={horizontalLabelRotation}
          origin={`${x}, ${y}`}
          key={Math.random()}
          x={x}
          textAnchor="end"
          y={y}
          {...this.getPropsForLabels()}
        >
          {yLabel}
        </Text>
      );
    });
  };

  renderVerticalLabels = config => {
    const {
      labels = [],
      width,
      height,
      paddingRight,
      paddingTop,
      horizontalOffset = 0,
      stackedBar = false,
      verticalLabelRotation = 0,
      formatXLabel = xLabel => xLabel
    } = config;
    const {
      xAxisLabel = "",
      xLabelsOffset = 0,
      hidePointsAtIndex = []
    } = this.props;
    const fontSize = 12;
    let fac = 1;
    if (stackedBar) {
      fac = 0.71;
    }
    return labels.map((label, i) => {
      if (hidePointsAtIndex.includes(i)) {
        return null;
      }
      const x =
        (((width - paddingRight) / labels.length) * i +
          paddingRight +
          horizontalOffset) *
        fac;
      const y = (height * 3) / 4 + paddingTop + fontSize * 2 + xLabelsOffset;
      return (
        <Text
          origin={`${x}, ${y}`}
          rotation={verticalLabelRotation}
          key={Math.random()}
          x={x}
          y={y}
          textAnchor={verticalLabelRotation === 0 ? "middle" : "start"}
          {...this.getPropsForLabels()}
        >
          {`${formatXLabel(label)}${xAxisLabel}`}
        </Text>
      );
    });
  };

  renderDefs = config => {
    const {
      width,
      height,
      backgroundGradientFrom,
      backgroundGradientTo
    } = config;
    const fromOpacity = config.hasOwnProperty("backgroundGradientFromOpacity")
      ? config.backgroundGradientFromOpacity
      : 1.0;
    const toOpacity = config.hasOwnProperty("backgroundGradientToOpacity")
      ? config.backgroundGradientToOpacity
      : 1.0;

    const fillShadowGradient = config.hasOwnProperty("fillShadowGradient")
      ? config.fillShadowGradient
      : this.props.chartConfig.color();

    const fillShadowGradientOpacity = config.hasOwnProperty(
      "fillShadowGradientOpacity"
    )
      ? config.fillShadowGradientOpacity
      : 0.1;

    return (
      <Defs>
        <LinearGradient
          id="backgroundGradient"
          x1="0"
          y1={height}
          x2={width}
          y2={0}
        >
          <Stop
            offset="0"
            stopColor={backgroundGradientFrom}
            stopOpacity={fromOpacity}
          />
          <Stop
            offset="1"
            stopColor={backgroundGradientTo}
            stopOpacity={toOpacity}
          />
        </LinearGradient>
        <LinearGradient
          id="fillShadowGradient"
          x1={0}
          y1={0}
          x2={0}
          y2={height}
        >
          <Stop
            offset="0"
            stopColor={fillShadowGradient}
            stopOpacity={fillShadowGradientOpacity}
          />
          <Stop offset="1" stopColor={fillShadowGradient} stopOpacity="0" />
        </LinearGradient>
      </Defs>
    );
  };
}

export default AbstractChart;
