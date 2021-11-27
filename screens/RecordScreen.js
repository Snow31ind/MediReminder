import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Image, ImageBackground } from "react-native";
import { BarChart, PieChart, ProgressChart } from "react-native-chart-kit";
import BarHeader from "../shared/BarHeader";
import pill from '../assets/medicationPill.png'
import { ProgressCircle } from "react-native-svg-charts";

const screenWidth = Dimensions.get('window').width;

export default function RecordScreen({navigation}){
    const [openOverall, setOpenOverall] = useState(true);
    const [openDaily, setOpenDaily] = useState(false);

    const MedicationProgress = ({name}) => {
        const chartConfig = {
            backgroundGradientFrom: "red",
            backgroundGradientFromOpacity: 0.5,
            backgroundGradientTo: "white",
            backgroundGradientToOpacity: 1,
            color: (opacity = 1) => `rgba(30, 20, 100, ${opacity})`,
            // color: 'beige',
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false // optional
          };

          const data = [
            {
              name: "Taken",
              population: 16,
              color: "#27E98C",
              legendFontColor: "black",
              legendFontSize: 15
            },
            {
              name: "Missed",
              population: 4,
              color: "#FF9696",
              legendFontColor: "black",
              legendFontSize: 15
            },
            {
              name: "Left",
              population: 10,
              color: '#8D8A8A',
              legendFontColor: 'black',
              legendFontSize: 15
            }
          ];

          const PRdata = {
            labels: ["Taken", "Missed"], // optional
            data: [0.4, 0.1]
          };

        
        return (
            <View style={styles.chartContainer}>
              <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                <Text>Medication A</Text>
                <Text>In progress</Text>
              </View>              

              <PieChart
              data={data}
              width={screenWidth}
              height={200}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              // center={[10, 50]}
              absolute
              />
                        
            </View>
        )
    }


    const OverallMode = () => {
        useEffect(() => {
            console.log(screenWidth);

            return () => {

            }
        }, [])


        return (
            <View style={{margin: 10}}>
              {/* <ImageBackground source={ <CustomProgressCircle/> } style={{width: 100, height: 100}} /> */}
              <CustomProgressCircle />
              <CustomProgressCircle />
              <CustomProgressCircle />
              <CustomProgressCircle />
              <CustomProgressCircle />
              <CustomProgressCircle />

                {/* <MedicationProgress />
                <MedicationProgress />
                <MedicationProgress />
                <MedicationProgress />
                <MedicationProgress />
                <MedicationProgress /> */}
            </View>
        )
    }

    const DailyItem = () => {
      return (
        <View style={styles.dailyItemContainer}>
          <Text>12/11/2021</Text>
          
          <View style={styles.dailyItem}>
            <Text>Missed(0)</Text>
            <Text>Taken(3)</Text>
            <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
              <Image source={pill} style={{height: 35, width: 35}} />
              <Text>Paracetamol(X1)</Text>
              <Text>7:00 AM</Text>
            </View>
          </View>
        </View>
      )
    }

    const DailyMode = () => {
        return (
            <ScrollView> 
                <DailyItem />
                <DailyItem />
                <DailyItem />
                <DailyItem />
                <DailyItem />
                <DailyItem />
                <DailyItem />
                <DailyItem />
            </ScrollView>
        )
    }

    const CustomProgressCircle = ({...rest}) => {

      return (
        <View style={{
          flexDirection: 'row',
          flex: 1,
          borderTopWidth: 1,
          // borderBottomWidth: 1,
          padding: 10
        }}>
          <View style={{alignItems: 'center'}}>
            <Text>Medication A</Text>
            <ProgressCircle
              style={{ height: 150, width: 150, marginTop: 10}}
              progress={ 0.75 }
              progressColor='#27E98C'
              backgroundColor='gray'
              startAngle={0}
              endAngle={360}
              strokeWidth={8}
            />
          </View>


          <View style={{backgroundColor: '', marginLeft: 70, alignItems: 'center'}}>
            <Text>Progress</Text>  
            
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>75%</Text>
            </View>
          </View>
        </View>
      )
    }

    return (
        <View style={{flex: 1}}>
            <BarHeader navigation={navigation} header={'Records'}/>
            <ScrollView>
              <View style={styles.container}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', padding: 10}}>
                      <TouchableOpacity
                          onPress={() => {
                              setOpenOverall(true);
                              setOpenDaily(false);
                          }}
                          style={{borderBottomColor: openOverall ? 'tomato' : 'gray', borderBottomWidth: 3}}
                      >
                          <Text style={styles.buttonText}>Overall</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                          onPress={() => {
                              setOpenOverall(false);
                              setOpenDaily(true);
                          }}
                          style={{borderBottomColor: openDaily ? 'tomato' : 'gray', borderBottomWidth: 3}}
                      >
                          <Text style={styles.buttonText}>Daily</Text>
                      </TouchableOpacity>
                  </View>            

                  {openOverall && <OverallMode />}
                  {openDaily && <DailyMode />}
              </View>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20
    },
    button: {
        // backgroundColor: 'gray',
        borderBottomColor: 'tomato',
        borderBottomWidth: 3
    },  
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    chartContainer: {
      // borderBottomWidth: 1,
      borderTopWidth: 1,
    },
    dailyItemContainer: {
      padding: 10
    },
    dailyItem: {
      backgroundColor: '#53cbff',
      padding: 10,
      borderRadius: 10,
    }

})