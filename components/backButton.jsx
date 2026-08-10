import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { theme } from '../constants/theme';
const BackButton = ({size = 26 , router}) => {
  return (
    <Pressable onPress={()=>router.back()} style={styles.button}>
    <HugeiconsIcon
      icon={ ArrowLeft01Icon }
      size={size}
      color={theme.colors.text}
      strokeWidth={2.5}
    /> 
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
  button:{
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius : theme.radius.sm,
    backgroundColor: 'rgba(0,0,0,0.07)'
  }
})