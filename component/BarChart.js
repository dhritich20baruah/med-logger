import React from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#FF474C",
    backgroundGradientTo: "#ffa300",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };

const BarGraph = ({ data }) => {
  return (
    <BarChart
      data={data}
      width={screenWidth}
      height={300}
      yAxisLabel=""
      chartConfig={chartConfig}
      verticalLabelRotation={30}
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
};

export default BarGraph