import React from "react";
import { View } from "react-native";
import { Svg, Polygon, Polyline, Path, Rect, G } from "react-native-svg/";
import AbstractChart from "../abstract-chart";
import { LegendItem } from "./legend-item";
import { Dots } from "./dots";
import { VerticalLines } from "./vertical-lines";
import { calcBaseHeight, calcHeight } from "./../chart-utils";

const Profiler = React.unstable_Profiler;

class LineChart extends AbstractChart {
  getColor = (dataset, opacity) => {
    return (dataset.color || this.props.chartConfig.color)(opacity);
  };

  getStrokeWidth = dataset => {
    return dataset.strokeWidth || this.props.chartConfig.strokeWidth || 3;
  };

  getDatas = data =>
    data.reduce((acc, item) => (item.data ? [...acc, ...item.data] : acc), []);

  getPropsForDots = (x, i) => {
    const { getDotProps, chartConfig = {} } = this.props;
    if (typeof getDotProps === "function") {
      return getDotProps(x, i);
    }
    const { propsForDots = {} } = chartConfig;
    return { r: "4", ...propsForDots };
  };

  renderShadow = config => {
    if (this.props.bezier) {
      return this.renderBezierShadow(config);
    }

    const {
      width,
      height,
      paddingRight,
      paddingTop,
      minDatasetValue,
      maxDatasetValue
    } = config;
    const baseHeight = calcBaseHeight(
      minDatasetValue,
      maxDatasetValue,
      height,
      this.props.fromZero
    );
    return config.data.map((dataset, index) => {
      return (
        <Polygon
          key={index}
          points={
            dataset.data
              .map((d, i) => {
                const x =
                  paddingRight +
                  (i * (width - paddingRight)) / dataset.data.length;
                const y =
                  ((baseHeight -
                    calcHeight(
                      d,
                      height,
                      minDatasetValue,
                      maxDatasetValue,
                      this.props.fromZero
                    )) /
                    4) *
                    3 +
                  paddingTop;
                return `${x},${y}`;
              })
              .join(" ") +
            ` ${paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                (dataset.data.length - 1)},${(height / 4) * 3 +
              paddingTop} ${paddingRight},${(height / 4) * 3 + paddingTop}`
          }
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />
      );
    });
  };

  renderLine = config => {
    if (this.props.bezier) {
      return this.renderBezierLine(config);
    }

    const {
      width,
      height,
      paddingRight,
      paddingTop,
      data,
      minDatasetValue,
      maxDatasetValue
    } = config;
    const output = [];
    const baseHeight = calcBaseHeight(
      minDatasetValue,
      maxDatasetValue,
      height,
      this.props.fromZero
    );
    data.forEach((dataset, index) => {
      const points = dataset.data.map((d, i) => {
        const x =
          (i * (width - paddingRight)) / dataset.data.length + paddingRight;
        const y =
          ((baseHeight -
            calcHeight(
              d,
              height,
              minDatasetValue,
              maxDatasetValue,
              this.props.fromZero
            )) /
            4) *
            3 +
          paddingTop;
        return `${x},${y}`;
      });

      output.push(
        <Polyline
          key={index}
          points={points.join(" ")}
          fill="none"
          stroke={this.getColor(dataset, 0.2)}
          strokeWidth={this.getStrokeWidth(dataset)}
        />
      );
    });

    return output;
  };

  getBezierLinePoints = (dataset, config) => {
    const {
      width,
      height,
      paddingRight,
      paddingTop,
      minDatasetValue,
      maxDatasetValue
    } = config;
    if (dataset.data.length === 0) {
      return "M0,0";
    }

    const x = i =>
      Math.floor(
        paddingRight + (i * (width - paddingRight)) / dataset.data.length
      );
    const baseHeight = calcBaseHeight(
      minDatasetValue,
      maxDatasetValue,
      height,
      this.props.fromZero
    );
    const y = i => {
      const yHeight = calcHeight(
        dataset.data[i],
        height,
        minDatasetValue,
        maxDatasetValue,
        this.props.fromZero
      );
      return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
    };

    return [`M${x(0)},${y(0)}`]
      .concat(
        dataset.data.slice(0, -1).map((_, i) => {
          const x_mid = (x(i) + x(i + 1)) / 2;
          const y_mid = (y(i) + y(i + 1)) / 2;
          const cp_x1 = (x_mid + x(i)) / 2;
          const cp_x2 = (x_mid + x(i + 1)) / 2;
          return (
            `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
            ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
          );
        })
      )
      .join(" ");
  };

  renderBezierLine = config => {
    return config.data.map((dataset, index) => {
      const result = this.getBezierLinePoints(dataset, config);
      return (
        <Path
          key={index}
          d={result}
          fill="none"
          stroke={this.getColor(dataset, 0.2)}
          strokeWidth={this.getStrokeWidth(dataset)}
        />
      );
    });
  };

  renderBezierShadow = config => {
    const { width, height, paddingRight, paddingTop, data } = config;
    return data.map((dataset, index) => {
      const d =
        this.getBezierLinePoints(dataset, config) +
        ` L${paddingRight +
          ((width - paddingRight) / dataset.data.length) *
            (dataset.data.length - 1)},${(height / 4) * 3 +
          paddingTop} L${paddingRight},${(height / 4) * 3 + paddingTop} Z`;
      return (
        <Path
          key={index}
          d={d}
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />
      );
    });
  };

  renderLegend = (width, legendOffset) => {
    const { legend, datasets } = this.props.data;
    const baseLegendItemX = width / (legend.length + 1);

    return legend.map((legendItem, i) => (
      <G key={Math.random()}>
        <LegendItem
          index={i}
          iconColor={this.getColor(datasets[i], 0.9)}
          baseLegendItemX={baseLegendItemX}
          legendText={legendItem}
          labelProps={{ ...this.getPropsForLabels() }}
          legendOffset={legendOffset}
        />
      </G>
    ));
  };

  logMeasurement = async (
    id,
    phase,
    actualTime,
    baseTime,
    startTime,
    commitTime,
    interactions
  ) => {
    console.log("--------- logProfile fired -----------");
    console.log(`${id}'s ${phase.toUpperCase()} phase:`);
    console.log(`Actual time: ${actualTime} ms`);
    console.log(`Base time: ${baseTime} ms`);
    console.log(`Start time (since component mounted): ${startTime} ms`);
    console.log(`Commit time (since component mounted): ${commitTime} ms`);
    console.log(interactions);
  };

  render() {
    const {
      width,
      height,
      data,
      withShadow = true,
      withDots = true,
      withInnerLines = true,
      withOuterLines = true,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      style = {},
      decorator,
      onDataPointClick,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      formatYLabel = yLabel => yLabel,
      formatXLabel = xLabel => xLabel
    } = this.props;
    const { labels = [] } = data;
    const {
      borderRadius = 0,
      paddingTop = 16,
      paddingRight = 64,
      margin = 0,
      marginRight = 0,
      paddingBottom = 0
    } = style;

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation
    };
    const legendOffset = this.props.data.legend ? height * 0.15 : 0;
    const datas = this.getDatas(this.props.data.datasets);
    const minDatasetValue = Math.min(...datas);
    const maxDatasetValue = Math.max(...datas);
    return (
      <Profiler id={"line chart content"} onRender={this.logMeasurement}>
        <View style={style}>
          <Svg
            height={height + paddingBottom + legendOffset}
            width={width - margin * 2 - marginRight}
          >
            <Rect
              width="100%"
              height={height + legendOffset}
              rx={borderRadius}
              ry={borderRadius}
              fill="url(#backgroundGradient)"
            />
            {this.props.data.legend &&
              this.renderLegend(config.width, legendOffset)}
            <G x="0" y={legendOffset}>
              {this.renderDefs({
                ...config,
                ...this.props.chartConfig
              })}
              <G>
                {withInnerLines
                  ? this.renderHorizontalLines({
                      ...config,
                      count: 4,
                      paddingTop,
                      paddingRight
                    })
                  : withOuterLines
                  ? this.renderHorizontalLine({
                      ...config,
                      paddingTop,
                      paddingRight
                    })
                  : null}
              </G>
              <G>
                {withHorizontalLabels
                  ? this.renderHorizontalLabels({
                      ...config,
                      count: minDatasetValue === maxDatasetValue ? 1 : 4,
                      data: datas,
                      paddingTop,
                      paddingRight,
                      formatYLabel
                    })
                  : null}
              </G>
              <G>
                {withInnerLines ? (
                  <VerticalLines
                    {...config}
                    backgroundLineProps={this.getPropsForBackgroundLines()}
                    data={data.datasets[0].data}
                    paddingTop
                    paddingRight
                  />
                ) : withOuterLines ? (
                  <VerticalLines
                    {...config}
                    backgroundLineProps={this.getPropsForBackgroundLines()}
                    paddingTop
                    paddingRight
                  />
                ) : null}
              </G>
              <G>
                {withVerticalLabels
                  ? this.renderVerticalLabels({
                      ...config,
                      labels,
                      paddingRight,
                      paddingTop,
                      formatXLabel
                    })
                  : null}
              </G>
              <G>
                {this.renderLine({
                  ...config,
                  paddingRight,
                  paddingTop,
                  data: data.datasets,
                  minDatasetValue,
                  maxDatasetValue
                })}
              </G>
              <G>
                {withShadow &&
                  this.renderShadow({
                    ...config,
                    paddingRight,
                    paddingTop,
                    minDatasetValue,
                    maxDatasetValue,
                    data: data.datasets
                  })}
              </G>
              <G>
                {withDots && (
                  <Dots
                    config={{
                      ...config,
                      paddingRight,
                      paddingTop,
                      onDataPointClick
                    }}
                    data={data.datasets}
                    paddingTop={paddingTop}
                    paddingRight={paddingRight}
                    datas={datas}
                    getDotColor={this.props.getDotColor}
                    getColor={this.getColor}
                    getPropsForDots={this.getPropsForDots}
                    fromZero={this.props.fromZero}
                    minDatasetValue={minDatasetValue}
                    maxDatasetValue={maxDatasetValue}
                  />
                )}
              </G>
              <G>
                {decorator &&
                  decorator({
                    ...config,
                    data: data.datasets,
                    paddingTop,
                    paddingRight
                  })}
              </G>
            </G>
          </Svg>
        </View>
      </Profiler>
    );
  }
}

export default LineChart;
