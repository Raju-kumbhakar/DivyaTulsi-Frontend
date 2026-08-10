import {Dimensions} from "react-native";

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export const hp = percenatge => {
      return (percenatge*deviceHeight)/100;
}

export const wp = percenatge => {
      return (percenatge*deviceWidth)/100;
}

