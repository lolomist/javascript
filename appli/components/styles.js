import { StyleSheet } from 'react-native'
  
 const containers = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",  
  },
  containerBasic: {
    height: "100%",
    width: "100%"
  },
  containerPadding: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    padding: 14
  },
  containerTransparent: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  center: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  rectangle: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "flex-end",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.25,
  },
 })

 const popup = StyleSheet.create({
  popup: {
    zIndex: 98,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  popup2: {
    zIndex: 99,
    backgroundColor: 'white',
    borderRadius: 5,
    position: "absolute",
    padding:20,
    top: "10%",
    left: "6%",
    right: "6%",
    bottom: "10%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  popup3: {
    zIndex: 100,
    height: "100%",
    alignItems: "center",
  },
  popupInt: {
    zIndex: 98,
    backgroundColor: 'white',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  textinput: {
    borderBottomWidth: 1,
    borderRadius: 5,
    width: "100%", 
    height: 30
  },
  textinput2: {
    borderBottomWidth: 1,
    borderRadius: 5,
    width: "70%",
    height: 30
  },
  textinput3: {
    borderBottomWidth: 1,
    borderRadius: 5, width: "25%",
    height: 30,
    marginLeft: 10 
  },
  textinput4: {
    borderBottomWidth: 1,
    borderRadius: 5,
    width: "50%",
    height: "5%"
  }
 })

 const blockacceuil = StyleSheet.create({  
    logo: {
      width: 50,
      height: 50,
      borderRadius: 30,
      alignItems: "center",
      backgroundColor: "#FF4500",
    },
    formulaire: {
      flexDirection: "column",
      justifyContent: "space-around",
      height: "100%"
    },
    textLogo: {
      marginTop: 5,
      marginLeft: 2,
      fontSize: 30,
      color: "white"
    },
    textLogo2: {
      marginTop: 7,
      marginLeft: 2,
      fontSize: 30,
      color: "white"
    },
    block: {
      width: "100%",
      height: "49%",
      padding: 20,
      backgroundColor: "white",
      shadowColor: "#303838",
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      shadowOpacity: 0.45,
      borderRadius: 20,
    },
    block3: {
      width: "100%",
      height: "45%",
      padding: 20,
      backgroundColor: "white",
      shadowColor: "#303838",
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      shadowOpacity: 0.45,
    },
    block2: {
      width: "100%",
      height: "38%",
      padding: 30,
    },
    textBlock: {
      fontSize: 45,
      marginTop: 5,
      fontWeight: '500',
      color: "#FF4500"
    },
    text2Block: {
      fontSize: 20,
      marginTop: 10,
      fontWeight: '500',
      color: "black"
    },
    blockConnection: {
      width: "75%",
      height: 50,
      padding: 5,
      flexDirection: "row",
      justifyContent:"flex-start",
      alignItems: "center",
      marginTop:30,
      backgroundColor: "#FF4500",
      borderRadius: 30,
    },
    blockConnection2: {
      width: "65%",
      height: 50,
      padding: 5,
      flexDirection: "row",
      justifyContent:"flex-start",
      alignItems: "center",
      marginTop:30,
      backgroundColor: "#FF4500",
      borderRadius: 30,
    },
    blockConnection3: {
      width: "75%",
      height: 50,
      padding: 5,
      flexDirection: "row",
      justifyContent:"flex-start",
      alignItems: "center",
      margin:15,
      backgroundColor: "#FF4500",
      borderRadius: 30,
    },
    blockRecup: {
      width: "13%",
      height: 50,
      marginLeft: 6,
      flexDirection: "row",
      justifyContent:"center",
      alignItems: "center",
      marginTop:30,
      backgroundColor: "#FF4500",
      borderRadius: 30,
    },
    textConnection: {
      fontSize: 20,
      fontWeight: '500',
      color: "white",
      marginLeft: 10,
    },
    textLogoConnection: {
      marginLeft: 2,
      fontSize: 30,
      color: "#FF4500"
    },
    textLogoConnection2: {
      marginTop: 2,
      marginLeft: 2,
      fontSize: 30,
      color: "#FF4500"
    },
    textLogoConnection3: {
      marginLeft: 1,
      fontSize: 30,
      color: "#FF4500"
    },
    logoConnection: {
      width: 40,
      height: 40,
      borderRadius: 30,
      alignItems: "center",
      backgroundColor: "white",
    }
 })  
  
 export { containers, blockacceuil, popup }  