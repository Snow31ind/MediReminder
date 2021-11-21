import React, { useState } from 'react'
import { Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native'
import pillImg from '../assets/medicationPill.png';

// function ReminderModal({
//     openModal

//     setopenModal

//     name, 
//     time, 
//     img, 
//     quantity}){
//     return (
//         <Modal
//             animationType='fade'
//             transparent={true}
//             visible={openModal

//             >
//                 <View style={{backgroundColor: 'rgba(52, 52, 52, 0.8)', flex: 1}}>
//                     <View style={styles.medicationInfModal}>
//                         <View>
//                             <Text style={{fontSize: 30}}> {name} </Text>
//                         </View>

//                         <View style={
//                             {
//                                 marginTop: '80%',
//                                 marginHorizontal: 20,
//                                 flexDirection: 'row',
//                                 justifyContent: 'center',
//                             }
//                         }>
//                             <View style={
//                                 {
//                                     width: 80,
//                                     marginRight: 60
//                                 }
//                             }>
//                                 <Button
//                                     title='Back'
//                                     onPress={() => setopenModal

//                                 />
//                             </View>
                            
//                             <View style={{
//                                 width: 80
//                             }}>
//                                 <Button
//                                     title='Confirm'
//                                     onPress={() => {
//                                         setopenModal

//                                     }}
//                                 />
//                             </View>
//                         </View>

//                     </View>
//                 </View>
//             </Modal>
//     )
// }

export default function MedicationItem({
    reminder}) {
    function addZero(i) {
        if (i < 10) {
            i = '0' + i
        }

        return i
    }

    const [openModal, setOpenModal] = useState(false);

    const medicationId = reminder.id;
    const medicationName = reminder.name;

    const reminderId = reminder.reminder.id;
    // const image = reminder.reminder.image;
    // const isMissed = reminder.reminder.isMissed;
    // const isTaken = reminder.reminder.isTaken;
    const quantity = reminder.reminder.quantity;
    // const timestamp = reminder.reminder.timestamp.toDate();

    // const hour = addZero(timestamp.getHours()) + ':' + addZero(timestamp.getMinutes());

    const time = reminder.reminder.timestamp
    return (
        <View>
            <TouchableOpacity onPress={() => {setOpenModal
							(!openModal
							)}}>
                <View style={styles.container}>
                    <Image source={pillImg}
                        style={{maxWidth: 40, maxHeight: 40}}
                    />
                    
                    <View style={styles.reminderInf}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{medicationName}</Text>

                            <View style={styles.timeContainer}>
                                <Text style={styles.time}>{time}</Text>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.quantity}>x{quantity}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

						<Modal
							visible={openModal}
							animationType='fade'
							transparent={true}
						>
							<View style={styles.modal}>
								<View style={styles.modalContainer}>
									<View style={styles.modalHeader}>
										<Image source={pillImg} style={{maxHeight: 80, maxWidth: 80}}/>

										<View style={[styles.textContainer, {marginLeft: 60, alignItems: 'center'}]}>
											<Text style={styles.text}>{medicationName}</Text>

											<View style={styles.timeContainer}>
												<Text style={styles.time}>{time}</Text>
											</View>
										</View>

									</View>

									<Text style={[styles.modalQuantity, styles.quantity]}>x{quantity}</Text>

									<View style={styles.buttonsContainer}>
										<TouchableOpacity style={[styles.modalButton, {backgroundColor: 'tomato'}]} onPress={() => setOpenModal(false)}>
											<Text>Back</Text>
										</TouchableOpacity>
										<TouchableOpacity style={[styles.modalButton, {backgroundColor: '#53cbff'}]} onPress={() => setOpenModal(false)}>
											<Text>Confirm</Text>
										</TouchableOpacity>
									</View>

								</View>
							</View>
						</Modal>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        margin: 20,
        padding: 15,
        borderRadius: 20,
        // borderWidth: 2,
        // borderColor: 'tomato',
        // borderStyle: 'solid',
        alignItems:'center',
        // justifyContent: 'space-between'
    },
    text: {
        fontSize: 16,
    },
    time: {
        fontSize: 16,
    },
    reminderInf : {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,

    },
    textContainer: {
        // backgroundColor: 'gray'
    },
    text : {
        fontSize: 16,
        fontWeight:'bold',
    },
    timeContainer : {
        backgroundColor: '#23AAE3',
        flexDirection: 'row',
        padding: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        // backgroundColor: 'yellow'
    },
    time : {
        // flexShrink: 1,
        // flexWrap: 'wrap'
        // backgroundColor: '#23AAE3',
    },
    quantity : {
        fontSize: 20
    },

		modal : {
			backgroundColor: 'rgba(52, 52, 52, 0.8)',
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		modalContainer: {
			width: '80%',
			height: '30%',
			backgroundColor: 'white',
			justifyContent: 'space-between',
			padding: 10,
			borderRadius: 20
			// alignItems: 'center'
		},
		medicationInfModal: {
			backgroundColor: 'beige',
			marginTop: '50%',
			marginBottom: '50%',
			height: '50%',
			marginHorizontal: 40,
			borderRadius: 10,
	},
	modalHeader: {
		flexDirection: 'row',
		// flex: 1
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly'
	},
	modalButton: {
		padding: 10,
		borderRadius: 10,
		width: 80,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalQuantity : {
		alignSelf: 'center'
	}
})
