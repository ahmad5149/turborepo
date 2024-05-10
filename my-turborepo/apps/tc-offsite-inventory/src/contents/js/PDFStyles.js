// styles.js
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30
  },
  section: {
    flexGrow: 1,
    textAlign: 'right', // Align text to the right
  },
  odometer_section: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-between', // Distribute space between items
    marginBottom: 10, 
  },
  odometer_sect: {
    flexDirection: 'row', // Arrange items horizontally
    marginBottom: 10, 
  },
  od_section: {
    flexDirection: 'row', // Arrange items horizontally
    marginBottom: '10pt', // Use points for margin
  },
  boldText: {
    fontSize: '10pt', // Use points for font size
    fontWeight: 'bold', // Make the text bold
    textAlign: 'left', // Align text to the start (left)
  },
  text10: {
    fontSize: 10, // Set font size to 10
    textAlign:'left',
  },
  text12: {
    fontSize: 12, // Set font size to 10
    textAlign:'left'
  },
  stock_text: {
    fontSize: 10, // Set font size to 10
    textAlign:'right'
  },
  heading: {
    fontSize: 13, // Set font size to 10
  },
  
  page_heading: {
    fontSize: 18, // Set font size to 10
    fontWeight: 'bold', // Make the text bold
  },
  underline: {
    textDecoration: 'underline', // Underline text
  },
  vehicleDescription: {
    marginTop:15,
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'space-between', // Distribute space between items
    marginBottom: 10,
  },
  colText: {
    flex: 1, // Take up remaining space
    borderBottom: 1, // Add a bottom border
    marginRight: 10, // Add some margin to the right
    textAlign: 'left', // Align text to the right

  },
  container: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'flex-start', // Align items to the start vertically
    alignItems: 'center', // Center items horizontally
  },
  image: {
    width: 100,
    height: 35,
  },
  purchaseSection: {
    flexDirection: 'row', // Arrange items horizontally
    marginBottom: 10, // Add some margin between sections
    marginTop: 25,   
},
lineHeight:{
    lineHeight:2.5
},
margin_Top5:{
    marginTop:5
},
margin_Top15:{
    marginTop:15
},
margin_Bottom10:{
    marginBottom:10
},
margin_Bottom5:{
    marginBottom:5
},
margin_Top20:{
    marginTop:20
},
margin_Top25:{
  marginTop:25
},
  addressText: {
    fontSize: 10,
    wordBreak: 'break-all', // Break text after reaching the end of the container
    width:150,
    textAlign:'left',
    marginLeft:5
  },
  font_Weight: {
    fontWeight: 'bold', // Make the text bold
  },
  square: {
    width: 10, // Set the width of the square
    height: 10, // Set the height of the square
    border: 1,
    marginRight:2
},
});
