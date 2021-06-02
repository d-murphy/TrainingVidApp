import React from 'react'
import axios from 'axios'

const HelloWorld = function (){

    axios.get('/api/completions/')
        .then(response => {
            var returnVal = response
            console.log(returnVal)  
    })
    .catch(error => {
        console.log(error)
    })

    return (
        <h3>Check the console.</h3>
    ) 
}

export default HelloWorld



