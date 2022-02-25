import { Animated, FlatListProps } from 'react-native';
import { useCollapsibleHeader } from 'react-navigation-collapsible';

const ToggleHeaderFlatList = (props:FlatListProps<any>) => {
  const options = {
    navigationOptions: {
      title:"coffee",
      // headerStyle: { backgroundColor: 'green', height: 150 } /* Optional */,
      // headerBackground: <Image /> /* Optional */,
    },
    config: {
      // collapsedColor: 'red' /* Optional */,
      useNativeDriver: true /* Optional, default: true */,
      elevation: 4 /* Optional */,
      disableOpacity: true /* Optional, default: false */,
    },
  };
  const {
    onScroll /* Event handler */,
    onScrollWithListener /* Event handler creator */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
    /* Animated.AnimatedValue contentOffset from scrolling */
    positionY /* 0.0 ~ length of scrollable component (contentOffset)
    /* Animated.AnimatedInterpolation by scrolling */,
    translateY /* 0.0 ~ -headerHeight */,
    progress /* 0.0 ~ 1.0 */,
    opacity /* 1.0 ~ 0.0 */,
  } = useCollapsibleHeader(options);

  /* in case you want to use your listener
  const listener = ({nativeEvent}) => {
    // I want to do something
  };
  const onScroll = onScrollWithListener(listener);
  */

  return (
    <Animated.FlatList
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: containerPaddingTop }}
      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
      /* rest of your stuff */
      {...props}
    />
  );
};

export default ToggleHeaderFlatList;