
import * as React from 'react';
import './Title.css'
// import styled from 'styled-components'

// const TitleDiv = styled.div`
// `

export const Title = ({children}: {children: any}) => (
  <div className="title">
    <h1>
      {children}
    </h1>
  </div>
);
