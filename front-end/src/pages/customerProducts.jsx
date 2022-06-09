import React, { useState } from 'react';
import { Container } from '@mui/material'
import NavBar from '../shared/components/navBar'
import CardDrinks from '../shared/components/cardDrinks'

export default function CustomerProducts() {
  return ( 
    <>
    <NavBar/>
      <CardDrinks/>
    </>
  )
};