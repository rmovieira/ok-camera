//necessário por causa do problema https://github.com/callstack/react-native-testing-library/issues/329
import React, { useState } from 'react';
import * as ReactNative from 'react-native';

export const Platform = {
    ...ReactNative.Platform,
    OS: 'android',
    Version: 123,
    select: objs => objs['android'],
};

// export const Switch = props => {
//     const [value, setValue] = useState(props.value);
//     return (
//         <ReactNative.TouchableOpacity
//             {...props}
//             onPress={() => {
//                 if (value === undefined) {
//                     return;
//                 }
//                 props.onValueChange(!value);
//                 setValue(!value);
//             }}
//             testID={props.testID}>
//             <ReactNative.Text>{`switch ${value.toString()}`}</ReactNative.Text>
//         </ReactNative.TouchableOpacity>
//     );
// };

let newRN = Object.defineProperty(ReactNative, 'Platform', Platform);

newRN = Object.defineProperty(ReactNative, 'PermissionsAndroid', {
    check: function () {
        Promise.resolve(true);
    },
    request: function () {
        Promise.resolve('granted');
    },
});


// newRN = Object.defineProperty(ReactNative, 'Switch', {
//     get: function () {
//         return Switch;
//     },
// });

module.exports = newRN;