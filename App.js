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
  TouchableOpacity, 
} from 'react-native';
import {keyboardData} from './keyboard.js';

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
  const [keyPress, setKeypress] = useState('');
  const [keyboard, setKeyboard] = useState([...keyboardData]); 

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
    if (keyPress.length < 5) {
      return; 
    }

    var text = keyPress.substring(0, 5);
    setKeypress('');

    if (text.localeCompare(wordRight)) {
      //if won
    }

    //get the result of each input placed by the user
    var startingIndex = line * 5;
    var textArrayCopy = letters;
    
    var j = 0;
    var indexKeyboard;
    var keyboardCopy = [...keyboard]; 
    for (var i = startingIndex; i < startingIndex + 5; i++) {
      var isRightNew = false; 
      var ispositionRightNew = false;
      var char = letters[i].value;

      for (let k = 0; k < keyboard.length; k++) {
        if (keyboard[k].value == char) {
          indexKeyboard = k; 
          break;
        }
      }
      console.log(indexKeyboard);
      var color; 
      //if correct 
      if (char == wordRight.charAt(j)) {
        textArrayCopy[i].isRight = true; 
        color = '#538D4E'; 
      }
      //if position wrong
      else if (wordRight.indexOf(char) > -1) {
        textArrayCopy[i].isPositionRight = true; 
        color = '#B59F3B'; 
      }
      //if both wrong
      else {
        textArrayCopy[i].isRight = false; 
        textArrayCopy[i].isPositionRight = false; 
        color = '#3A3A3C'; 
      }
      textArrayCopy[i].color = color; 
      keyboardCopy[indexKeyboard].color = color;
      j++;
    };

    setLetters([...textArrayCopy]);
    setLine(line + 1);
    setKeyboard([...keyboardCopy]);
    setKeypress(''); 
  }

  const keyPressHandler = (key) => {
    if (key == '✓') {
      submitHandler(); 
      return; 
    }
    var keyPressCopy = keyPress + key; 
    setKeypress(keyPressCopy);
    keyHandler(keyPressCopy);
  } 
  return (
    <SafeAreaView style={styles.container}>                         
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
      <View style={styles.keyboard}>
        {keyboard.map((key, index) => {
          return (
            <View style={{
              backgroundColor: '#121213', 
              height: String((100/3) + '%'), 
              width: String(10 * key.size + '%'), 
              justifyContent: 'center', 
              alignItems: 'center', 
            }} key={index}>
              <TouchableOpacity style={{
                justifyContent: 'center',
                width: '90%', 
                height: '90%', 
                borderRadius: 5, 
                backgroundColor: key.color, 
              }} onPress={() => keyPressHandler(key.value)}>
                <Text style={{
                  fontSize: 25, 
                  fontFamily: 'sans-serif', 
                  textAlign: 'center', 
                  color: '#FFFFFF', 
                }}>{key.value}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

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
    justifyContent: 'flex-start',
    paddingTop: 40, 
  },
  promptTextWin: {
    padding: 10, 
    fontSize: 70, 
    fontFamily: 'Roboto',
    fontWeight: 'bold',  
    color: '#80ed99', 
  }, 
  promptTextNext: {
    color: '#7B7B7B', 
    padding: 10, 
    fontSize: 25, 
    fontFamily: 'Roboto', 
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
  }, 

  keyboard: {
    height: '30%',
    width: '100%', 
    backgroundColor: '#121213', 
    position: 'absolute', 
    bottom: 0, 
    flexDirection: 'row', 
    flexWrap: 'wrap'
  }
  //green = #538D4E
  //yellow = #B59F3B
  //white = #FFFFFF
});
