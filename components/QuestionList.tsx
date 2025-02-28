import React, {useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

// question list (import from assets/questions.json)

const QuestionList = ({changeAnswer, questions}) => {
  if(questions.length === 0) return null
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {questions.map((q, index) =>{
          if(q.type=='multi'){
            return (
                <View key={q.id} style={styles.selectBoxContainer}>
                  <Text style={styles.label}>{q.question}</Text>
                  <Picker
                    key={q.id}
                    selectedValue={q.answer}
                    onValueChange={(newAnswer) => changeAnswer(q.id, newAnswer)}
                    style={styles.picker}
                  >
                    <Picker.Item style={styles.pickerItem} label="" value=""/>
                    {q.possible_answers.map((possible_answer) => {
                      return(
                        <Picker.Item key={q.id} style={styles.pickerItem} label={possible_answer} value={possible_answer} />
                      )
                    })}
                  </Picker>
                </View>
              )
            }
            else if(q.type=='textbox'){
                return (
                  <View key={q.id} style={styles.textBoxContainer}>
                    <Text style={styles.textBoxLabel}>{q.question}</Text>
                    <TextInput
                      style={styles.input}
                      value={q.answer}
                      onChangeText={(newAnswer) => changeAnswer(q.id, newAnswer)}
                      multiline
                    />
                  </View>
                )
              }
              else if(q.type=='boolean'){
                return (
                  <View key={q.id} style={styles.selectBoxContainer}>
                  <Text style={styles.label}>{q.question}</Text>
                  <Picker
                    key={q.id}
                    selectedValue={q.answer}
                    onValueChange={(newAnswer) => changeAnswer(q.id, newAnswer)}
                    style={styles.picker}
                  >
                    <Picker.Item style={styles.pickerItem} label="" value="" />
                    <Picker.Item style={styles.pickerItem} label="yes" value="yes" />
                    <Picker.Item style={styles.pickerItem} label="no" value="no" />
                  </Picker>
                </View>
                )
            }else return null
          }
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    padding: 20,
    flexDirection: "column", 
    alignItems: "center", 
    marginLeft: 30,
    marginRight: 30,
  },
  innerContainer:{
    // backgroundColor: "green",
    // padding: 20,
    paddingTop: 0,
    flexDirection: "column", 
    alignItems: "flex-start", 
  },
  selectBoxContainer: {
    // backgroundColor: "purple"
    flexDirection: "row", 
    marginBottom: 10,
    marginTop:20
  },
  textBoxContainer: {
    // backgroundColor: "orange",
    marginBottom: 10,
    height: 100,
    width:335,
  },
  label: {
    // backgroundColor: "blue"
    color:"white",
    fontSize: 15,
    marginLeft: 25,
    width: "90%",
  },
  textBoxLabel: {
    // backgroundColor: "blue"
    marginLeft: 25,
    marginBottom: 10,
    color:"white",
    fontSize: 15,
    width: "90%",
  },
  picker: { 
    height: 50, 
    width: 120,
    marginLeft: 10
  },
  pickerItem:{
    backgroundColor: "white",
  },
  input: {
    marginLeft: 25,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "white",
    height: "60%",
    textAlignVertical: "top",
  },
});

export default QuestionList;
