import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function couter() {
    const [count, setCount] = useState<number>(0);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
    return (
        <SafeAreaView>
            <View>
                <Text>
                    {count}
                </Text>
            </View>
        </SafeAreaView>
    );
}