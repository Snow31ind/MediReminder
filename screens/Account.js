import React, {useState} from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity, Modal } from 'react-native'
import { set } from 'react-native-reanimated';
import BarHeader from '../shared/BarHeader'
import EditAccount from './EditAccount';
import Homepage from './Homepage';


export default function Account({setOpenAccount}) {
    const [edit, setEdit] = useState(false);
    const openEditing = () => {
        // Open editing page
        setEdit(true);
    }

    return (
        <View>
            {/* <Button 
                title='Close'
                onPress={() => setOpenAccount(false)}
            /> */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Account
                </Text>
            </View>
            
            <Text style={styles.username}>Username</Text>
            <Text style={styles.gender}>Gender</Text>
            <Text style={styles.birth_date}>Birth date</Text>
            <Text style={styles.email}>Email</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={openEditing} 
                underlayColor='#23aae3'
            >
                <View>
                    <Text style={styles.text}>EDIT</Text>
                </View>
            </TouchableOpacity>
            <Modal
                visible={edit}
                animationType='slide' 
            >
                <EditAccount/>
            </Modal>

            <TouchableOpacity
                style={styles.close}
                onPress={() => setOpenAccount(false)} 
                underlayColor='#23aae3'
            >
                <View>
                    <Text style={styles.text}>CLOSE</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#53cbff'
    },
    header: {
        height: 80,
        flexDirection: 'row',
        justifyContent: "center",
        backgroundColor: '#53cbff',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    username: {
        position: 'absolute',
        top: 162,
        left: 50,
        fontSize: 15
    },
    gender: {
        position: 'absolute',
        top: 192,
        left: 50,
        fontSize: 15
    },
    birth_date: {
        position: 'absolute',
        top: 222,
        left: 50,
        fontSize: 15
    },
    email: {
        position: 'absolute',
        top: 252,
        left: 50,
        fontSize: 15
    },
    button: {
        top: 500,
        left: 50,
        width: 130,
        height: 67,
        borderRadius: 20,
        backgroundColor: '#23aae3',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontSize: 24,
        padding: 20,
    },
    close: {
        top: 433,
        left: 210,
        width: 130,
        height: 67,
        borderRadius: 20,
        backgroundColor: '#23aae3',
        alignItems: 'center'
    },
})
