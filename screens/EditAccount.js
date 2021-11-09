import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Picker } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Account from './Account'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditAccount({setEdit}){
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [selectedGender, setSelectedGender] = useState("Male");
    return (
        <View>
            <View style={styles.header}>
                <Button 
                    style={styles.closeButton}
                    title='Close'
                    onPress={()=>setEdit(false)} // Hasn't close the modal properly
                />
                {/* <Text style={styles.headerText}>Edit Account</Text> */}
            </View>
            <Text style={{top: 30, left: 30}}>Username</Text>
            <TextInput
                style={styles.inputName}
                placeholder="Cho nay la current name dang dung"
            />
            <Text style={{top: 30, left: 30}}>Gender</Text>
            <Picker
                selectedGender={selectedGender}
                style={{top: -50, width: 150, alignSelf:'center' }}
                onValueChange={(itemValue, itemIndex) => setSelectedGender(itemValue)}
            >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
            </Picker>
            <Text style={{top: -50, left: 30}}>Birth date</Text>
            <DateTimePicker
                style={styles.datepick}
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                // onChange={onChange}
            />
            <Text style={{top: -50, left: 30}}>Email</Text>
            <TextInput
                style={styles.inputEmail}
                placeholder="Email"
            />

            <TouchableOpacity
                style={styles.saveButton}
                onPress={()=>setEdit(false)} // Save the new information and close the modal
                underlayColor='#23aae3'
            >  
                <View>
                    <Text style={styles.buttonText}>SAVE</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    closeButton: {
        position:'absolute',
        left: 16,
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
    inputName: {
        top: 25,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    inputEmail: {
        top: -55,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    datepick: {
        top: -75,
        right: 50,
    },
    saveButton: {
        top: 0,
        width: 130,
        height: 67,
        borderRadius: 20,
        backgroundColor: '#23aae3',
        alignSelf: 'center',
        alignItems:'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        padding: 20,
    },
})
