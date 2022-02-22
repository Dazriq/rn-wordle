import { StatusBar } from 'expo-status-bar';
import { useState, useRef} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableWithoutFeedback, 
  TouchableHighlight, 
  TextInput, 
  Dimensions, 
  TouchableOpacity, 
  Animated, 
  Vibration, 
  Button, 
} from 'react-native';
import {keyboardData} from './keyboard.js';
import { scanDictionary } from './dictionary-eng.js';

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
  const [wordRight, setWordRight] = useState('WORDS');
  const [keyPress, setKeypress] = useState('');
  const [keyboard, setKeyboard] = useState([...keyboardData]); 
  const [dictionary, setDictionary] = useState(dictionary);
  const [blurScreen, setBlurScreen] = useState(false); 
  const [keyboardVisibility, setKeyboardVisibility] = useState(true); 
  const [winTextVisibility, setwinTextVisibility] = useState(false); 

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const winTextAnimPosition = useRef(new Animated.Value(0)).current;
  const winTextAnimOpacity = useRef(new Animated.Value(0)).current;
  
  const fadeInOut = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10, 
      useNativeDriver: false, 
    }).start();
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000, 
        useNativeDriver: false, 
      }).start();
    }, 10);
  };

  const winTextPrompt = () => {
    //Vibration.vibrate(500); 
    setwinTextVisibility(true);   
    Vibration.vibrate([15,500], false);
    //blur the background
    setBlurScreen(true); 
    setKeyboardVisibility(false);
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(winTextAnimOpacity, {
      toValue: 1, 
      duration: 500, 
      useNativeDriver: false, 
    }).start();
    Animated.spring(winTextAnimPosition, {
      toValue: (windowHeight/2 - windowHeight * 0.3/2),
      useNativeDriver: false, 
      duration: 1000,  
    }).start();
  };

  const winTextretrieve = () => {
    //TODO:retrieve wintext when blurred background is pressed
    //unblur the background
    if (winTextVisibility) {
      setwinTextVisibility(false); 
      Animated.timing(winTextAnimOpacity, {
        toValue: 0, 
        duration: 2, 
        useNativeDriver: false, 
      }).start();
    }
    else {
      setwinTextVisibility(true);
      Animated.timing(winTextAnimOpacity, {
        toValue: 1, 
        duration: 2, 
        useNativeDriver: false, 
      }).start();
    }

  };


  const keyHandler = (newText) => {
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
    
    //check whether inside dictionary or not
    var isWord = scanDictionary(text); 
    if (!isWord) {
      fadeInOut(); 
      return; 
    }
    //if not inside dictionary
    else {
      setKeypress('');

      if (text === wordRight) {
        winTextPrompt();
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
  }

  const keyPressHandler = (key) => {
    //if backspace is pressed
    if (key == '⌫') {  
      console.log(letters);
      var letterIndex; 
      if (letters[0].value === '') {
        return; 
      }
      for (let i = letters.length - 1; i >= 0; i--) {
        if (letters[i].value != '') {
          letterIndex = i;
          break; 
        }
      }
      console.log(letterIndex); 
      console.log(line * 5 - 1); 
      if (letterIndex == (line * 5 - 1)) {
        return; 
      }
      
      var keyPressCopy = keyPress; 
      keyPressCopy = keyPressCopy.substring(0, keyPressCopy.length - 1); 
      setKeypress(keyPressCopy); 

      var lettersCopy = letters; 
      lettersCopy[letterIndex].value = ''; 
      
      setLetters([...lettersCopy]); 
      return; 
    }
    //if enter is pressed
    else if (key == '✓') {
      submitHandler(); 
      return; 
    } 
    else {
      var keyPressCopy = keyPress;
      keyPressCopy = keyPressCopy + key;  
      setKeypress(keyPressCopy);
      keyHandler(keyPressCopy);
    }
  } 
  return (
    <SafeAreaView style={styles.container}>   
      { blurScreen && <TouchableHighlight onPress={() => winTextretrieve} style={styles.blurContainer}>
        <Text style={{height: '100%', width: '100%'}}>Hello world</Text>
      </TouchableHighlight>
      }
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
      {keyboardVisibility && 
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
      }

      <Animated.View
        style={[
          styles.fadingContainer,
          {
            // Bind opacity to animated value
            opacity: fadeAnim
          }
        ]}
      >
        <Text style={styles.fadingText}>Not in word list!</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.winTextContainer, {
            // Bind opacity to animated value
            top: winTextAnimPosition, 
            opacity: winTextAnimOpacity, 
          }
        ]}
      >
        <Text style={styles.winText}>🆆🅾🅽</Text>
        <Text style={styles.reloadIcon}>↻</Text>
      </Animated.View>

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

  fadingContainer: {
    backgroundColor: '#ffffff', 
    position: 'absolute', 
    borderRadius: 5, 
    top: 0.3 * windowHeight, 
    elevation: 3, 
  },
  fadingText: {
    fontSize: 20, 
    fontFamily: 'sans-serif', 
    padding: 10, 
    color: '#121213'
  },

  title: {
    fontSize: 50, 
    paddingBottom: 5, 
    fontFamily: 'sans-serif-condensed', 
    fontWeight: 'bold', 
    color: '#ffffff', 
    
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
  }, 
  
  blurContainer: {
    top: '5%', 
    height: '100%',
    width: '100%',  
    backgroundColor: '#121213', 
    position: 'absolute', 
    elevation: 4, 
    opacity: 0.8, 
  },

  winTextContainer: {
    backgroundColor: '#501537', 
    height: windowHeight * 0.3, 
    width: windowWidth * 0.8, 
    position: 'absolute', 
    elevation: 5, 
    borderRadius: windowWidth * 0.8 / 5, 
    borderWidth: 5, 
    borderColor: 'rgba(0, 0, 0, 0.5)', 
  }, 

  winText: {  
    color: '#ebb9df', 
    fontSize: 70, 
    fontFamily: 'sans-serif-medium', 
    textAlign: 'center', 
    top: '10%', 
    letterSpacing: 3, 
  }, 

  reloadIcon: {
    color: '#ebb9df', 
    fontSize: 100, 
    fontFamily: 'sans-serif-medium', 
    textAlign: 'center', 
  }
  //green = #538D4E
  //yellow = #B59F3B
  //white = #FFFFFF
});
