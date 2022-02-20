import { StatusBar } from 'expo-status-bar';
import { useState} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableHighlight, 
  TextInput, 
  Dimensions, 
} from 'react-native';



export default function App() {

  let textArray = []
  for (var i = 0; i < 30; i++) {
    textArray[i] = {
      value: '', 
      isRight: null, 
      isPositionRight: null,
      color: '#3A3A3C', 
    }
  }
  const [letters, setLetters] = useState(textArray);
  const [line, setLine] = useState(0);
  const [input, setInput] = useState('');
  const [wordRight, setWordRight] = useState('LUKIS');

  const keyHandler = (newText) => {
    setInput(newText);
    var j = 0;
    var textArrayCopy = letters;
    for (let i = line * 5; i < (line * 5) + 5; i++) {
      var newElement = {
        value: newText.charAt(j).toUpperCase(), 
        isRight: null, 
        isPositionRight: null, 
        color: '#3A3A3C', 
      }
      textArrayCopy[i] = newElement;
      j++;
    }

    setLetters([...textArrayCopy]);
  }

  const submitHandler = () => {

    //exit function call if length is less than 5
    if (input.length < 5) {
      return; 
    }

    var text = input.substring(0, 5);

    if (text.localeCompare(wordRight)) {
      alert('you have won!');
    }

    //get the result of each input placed by the user
    var startingIndex = line * 5;
    var textArrayCopy = letters;

    var j = 0;
    for (var i = startingIndex; i < startingIndex + 5; i++) {
      var isRightNew = false; 
      var ispositionRightNew = false;
      var char = letters[i].value
      //if correct 
      if (char == wordRight.charAt(j)) {
        textArrayCopy[i].isRight = true; 
        textArrayCopy[i].color = '#538D4E'; 
      }
      //if position wrong
      else if (wordRight.indexOf(char) > -1) {
        textArrayCopy[i].isPositionRight = true; 
        textArrayCopy[i].color = '#B59F3B'; 
      }
      //if both wrong
      else {
        textArrayCopy[i].isRight = false; 
        textArrayCopy[i].isPositionRight = false; 
      }
      j++;
    };

    console.log(textArrayCopy);
    setLetters([...textArrayCopy]);
    setLine(line + 1);
    setInput('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
          position: 'absolute', 
          height: '25%', 
          width: '60%', 
          backgroundColor: 'white', 
          elevation: 2, 
          justifyContent: 'center', 
          alignItems: 'center', 
           
        }}>
          <Text stle={styles.promptText}>YOU'VE WON</Text> 
          <Text stle={styles.promptText}>NEXT</Text>
      </View>
      <Text style={styles.title}>Infinite Wordle</Text>
      <View style={styles.wordsContainer}>
        {letters.map((letter, index) => {
          if (letter.value == '') {
            return (
              <View style={styles.letterContainer} key={index}>
                <View style={styles.letterContainerBorder}>
                  <Text style={styles.letter}>{letter.value}</Text>
                </View>
              </View>
            );
          }
          else {
            return (
              <View style={{
                  width: '20%', 
                  height: '16.6666666666666666666667%', 
                  borderWidth: 3, 
                  borderColor: '#121213', 
                  justifyContent: 'center', 
                  backgroundColor: letter.color, 
                  }} 
                key={index}>
                <Text style={styles.letter}>{letter.value}</Text>
              </View>
            );
          }
        }     
        )}
      </View>        
      <TextInput 
        caretHidden={true} 
        style={styles.invisibleInput}
        value={input}
        onChangeText={(newText) => keyHandler(newText)}
        onSubmitEditing={submitHandler}
      />
      <StatusBar style="auto"/>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121213',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    color: 'blue', 
    padding: 10, 
    fontSize: 30, 
    fontFamily: 'notoserif', 
  }, 
  title: {
    fontSize: 50, 
    paddingBottom: 5, 
    fontFamily: 'sans-serif-condensed', 
    fontWeight: 'bold', 
    color: '#ffffff', 
    
  }, 
  invisibleInput: {
    height: '50%', 
    width: '90%',
    backgroundColor: 'transparent', 
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    color: 'transparent', 
  }, 
  wordsContainer: {
    height: windowHeight * 0.5, 
    width: windowWidth * 0.9,
    flexDirection: 'row',
    flexWrap: 'wrap',
  }, 
  letterContainer: {
    width: '20%', 
    height: '16.6666666666666666666667%', 
    borderWidth: 3, 
    borderColor: '#121213', 
    justifyContent: 'center', 
    backgroundColor: '#3A3A3C', 
  },

  letterContainerBorder: {
    height: '100%', 
    width: '100%',
    borderColor: '#3A3A3C',
    borderWidth: 2,
    backgroundColor: '#121213', 
  }, 

  letter: {
    textAlign: 'center', 
    fontFamily: 'Roboto', 
    fontSize: 38,
    fontWeight: 'bold', 
    color: '#ffffff', 
  }
  //green = #538D4E
  //yellow = #B59F3B
  //white = #FFFFFF
});
