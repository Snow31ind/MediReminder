import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export default function AccountScreen({setOpenAccount}) {
    const [edit, setEdit] = useState(false);
    const openEditing = () => {
        // Open editing page
        setEdit(true);
    }

    return (
        <View>
            <Button 
                title='Close'
                onPress={() => setOpenAccount(false)}
            />
            <Text> Account </Text>
        </View>
    )
}

const styles = StyleSheet.create({

})
