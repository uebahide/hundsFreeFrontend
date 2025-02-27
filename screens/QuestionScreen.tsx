import React, { useEffect, useState } from "react";
import { getServerUrl, isAllQuestionAnswered, loadQuestions } from "../utility/helpers";
import { Button, useTheme } from "react-native-paper";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import QuestionList from "../components/QuestionList";

type QuestionType = {
  id: number;
  question: string;
  type: string;
  possible_answers?: string[];
  answer: string;
};


const QuestionScreen = ({route, navigation}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  //load questions
  useEffect(() => {
    try{
      const questions = loadQuestions(); 
      setQuestions(questions);
    }catch(error){
      console.log(error)
    }
  }, []);

  const changeAnswer = (id, newAnswer) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === id ? { ...q, answer: newAnswer } : q
      )
    );
  }

  const handleSubmit = async () => {
    const url = await getServerUrl();
    const questionAndAnswers = questions.reduce((acc, q) => ({ ...acc, [q.question]: q.answer}), {})
    
    const payload = {...route.params.payload,
      "truth_labels": questionAndAnswers 
    }
    
    if(!isAllQuestionAnswered(questionAndAnswers)){ //if some answers are empty (not answered yet)
      alert("Please answer all the questions."); //pyload can not be sent to the server yet
    }else{
      console.log("handle submit---")
      try{
        const response = await fetch(`${url}/submit-form`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          navigation.navigate("RecordingScreen", {
            message: "Data sent successfully",
          });
        } else {
          throw new Error("Failed to submit edited data");
        }
      } catch (error) {
        console.error("Error submitting edited data:", error);
      }
    }
  }

    
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <QuestionList questions={questions} changeAnswer={changeAnswer} />
            <Button
              style={styles.button}
              onPress={handleSubmit}
              mode="outlined"
              uppercase
              textColor={"white"}
            >
              Submit
            </Button>
          </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
  
  
}

const getStyles = (theme) =>
  StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: "gray",
      padding: 10,
      borderRadius: 5,
      color: "white",
      height: "45%",
      textAlignVertical: "top",
    },
    button: {
      margin: 32,
      borderRadius: 0,
      width: 200,
      alignSelf: "center",
    },
    scrollContainer: {
      flexGrow: 1, // this make scrolling enable
      justifyContent: "flex-start",
      alignItems: "center",
      paddingBottom: 50, 
      padding: 10,
      backgroundColor: theme.colors.primary,
    },
  });


export default QuestionScreen