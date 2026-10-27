// SparklineChart - tiny inline SVG price chart
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  width = 80,
  height = 36,
  color,
}) => {
  if (!data || data.length < 2) return null;

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  const points = data
    .map((val, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((val - minVal) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default SparklineChart;
