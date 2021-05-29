import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { Header, Input, Button, Icon, Text } from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { config } from "./config"

const App = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sign, setsign] = useState(false)
  const [error, seterror] = useState('')
  const [load, setload] = useState(false)
  const [loggedIN, setloggedIN] = useState(null)

  const signUp = () => {
    setload(true)

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(() => {
        seterror("Auth Failed")
      }).then(() => check())
  }

  const signIn = () => {
    setload(true)

    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(() => {
        seterror("Auth Failed")
      }).then(() => check())
  }

  const check = () => {
    setload(false)
    firebase.auth().onAuthStateChanged((user) => {
      user ? setloggedIN(true) : setloggedIN(false)
    })
  }
  const data = () => {
    const user = firebase.auth().currentUser;
    return user.email
  }

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      firebase.app();
    }

    check()
  }, []);

  if (loggedIN === null) {
    return <ActivityIndicator size={'large'} color="red" style={styles.load} />
  }

  else if (!loggedIN) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
        <Header
          containerStyle={{ paddingTop: 30, top: 0, position: "absolute" }}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'HOME', style: { color: '#fff', letterSpacing: 1 } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <Input
          inputContainerStyle={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="red"
          placeholder={`Enter Email for  ${sign ? "Sign Up" : "Sign In"}`}
          leftIcon={<FontAwesome5 name={'envelope'} color="red" size={20} style={{ margin: 10 }} />}
        />
        <Input
          inputContainerStyle={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="red"
          leftIcon={<FontAwesome5 name={'lock'} color="red" size={20} style={{ margin: 10 }} />}
        />
        {load
          ? <ActivityIndicator size={'large'} color="red" />
          : <Button
            buttonStyle={styles.button}
            titleStyle={{ color: "white" }}
            onPress={() => {
              sign ? signUp() : signIn()
              seterror('')
            }}
            icon={
              <Icon
                style={{ marginRight: 10 }}
                name="login"
                size={20}
                color="white"
              />
            }
            title="Log in"
          />}
        <Button
          buttonStyle={styles.button}
          titleStyle={{ color: "white" }}
          onPress={() => {
            setsign(!sign)
            setEmail("")
            setPassword("")
            setload(false)
            seterror('')
          }}
          title={`${sign ? "Sign In" : "Sign Up"}`}
        />
        {error ? <Text style={styles.text}>{error}</Text> : null}
      </SafeAreaView>
    );
  }

  else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
        <Header
          containerStyle={{ paddingTop: 30, top: 0, position: "absolute" }}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'DASHBOARD', style: { color: '#fff', letterSpacing: 1 } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />

        <Text style={styles.welcome}> Welcome </Text>
        <Text style={styles.welcome}>{data()}</Text>
        <Button
          buttonStyle={styles.button}
          titleStyle={{ color: "white" }}
          onPress={() => firebase.auth().signOut()}
          title="Sign Out"
        />
      </SafeAreaView>
    )
  }
};

const styles = StyleSheet.create({
  input: {
    marginTop: 15,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: "black"
  },
  welcome: {
    marginTop: 15,
    fontSize: 20,
  },
  button: {
    marginTop: 15,
    paddingHorizontal: 30,
    backgroundColor: "tomato"
  },
  load: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "red",
    backgroundColor: "white"
  },
  text: {
    marginTop: 15,
    color: "red",
    fontSize: 18,
    fontWeight: "bold"
  },
})

export default App;
