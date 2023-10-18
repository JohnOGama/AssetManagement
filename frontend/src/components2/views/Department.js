/* 

Date : 10 / 18 / 23
Author : Nole
Activities
Purpose : 
  Create Department.js 
    import { useLocation,Link } from 'react-router-dom'
    import Logs from 'components/Utils/logs_helper'
    import  { useEffect, useState } from 'react'
    import axios from 'axios'
    import decoder from 'jwt-decode'
        
*/

import { useLocation,Link } from 'react-router-dom'
import Logs from 'components/Utils/logs_helper'
import  { useEffect, useState } from 'react'
import axios from 'axios'
import decoder from 'jwt-decode'

import React from 'react'

import {
  FormLabel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Stack,
    Box,
    Input,
    FormControl,
  } from "@chakra-ui/react";
  import { Button, ButtonGroup } from "@chakra-ui/react";
  import Card from "components/Card/Card";

const Department = () => {

  const location = useLocation()
  const  departmentID  = location.state?.departmentID

  const [btnstate,setbtnState] = useState('Save')

  
  const [values,setDepartments] = useState({
    departmentid:'',
    departmentname:'',
    description:''
})


useEffect(() => {
      
  try {
    
    if(departmentID) {
        console.log("Dept ID : " + departmentID)
        axios.get('/getDepartmentByID/' + departmentID)
        .then((res) => {
          setbtnState("Update")
            setDepartments({
              ...values,
              departmentid: res.data.result[0].departmentDisplayID,
              departmentname: res.data.result[0].departmentName,
              description: res.data.result[0].description
            })
           
        })
        .catch((err) => {
          alert(err);
        });
      
    } else {
      setbtnState("Save")
       
      setDepartments({
          ...values,
          departmentid: '',
          departmentname: '',
          description: ''
        })
    }

  }
  catch(err) {
    alert(err)
  }
}, [])


async function handleUpdate(event)  {

    try {

      event.preventDefault();

      const tokenStorage = localStorage.getItem("token");
      const tokenDecoded = decoder(tokenStorage);

      const userID = tokenDecoded.result[0].userDisplayID;

    
      const departmentvalues = {
        departmentid: values.departmentid,
        departmentname: values.departmentname,
        description: values.description,
        userID: userID
      }

      if(departmentvalues.departmentid === "") {
        // insert here
        const success = await axios.post('/create-department',departmentvalues)
        .then((res) => {
        
          alert("Insert Successful")

          const InsertLogs = new Logs(
            'Info',
            "Department",
            "Function /handleUpdate",
            ' Create   Department name :  ' + departmentvalues.departmentname,
            userID
          )
  
          const request = axios.post('/log',InsertLogs.getLogs())
          const response =  request.data

         window.location.href = "/#/admin/department-viewer"
          

        })
        .catch((err) => {
          alert(err);
        });
      } else if(!departmentvalues.departmentid == "") {
        /// update here

        const success = await axios.post('/updateDepartmentByID',departmentvalues)
        .then((res) => {
        
          alert("Update Successful")

          const InsertLogs = new Logs(
            'Info',
            "Department",
            "Function /handleUpdate",
            ' Update DepartmentID : ' +  departmentvalues.departmentid
            + ' Departmentname :  ' + departmentvalues.departmentname,
            userID
          )
  
          const request = axios.post('/log',InsertLogs.getLogs())
          const response =  request.data

         window.location.href = "/#/admin/department-viewer"
          
        })
        .catch((err) => {
         
          const errorStatus = err.code
    
          if( errorStatus.includes('ERR_NETWORK') ) 
          {

            
            const submitLogs = new Logs(
              "DB",
              "Department",
              "Function /Handleupdate",
              err,
              userID
            )
            
            alert( submitLogs.getMessage() )

          } else if ( errorStatus.includes('ERR_BAD_REQUEST') ) {
           
            const submitLogs = new Logs(
              'Error',
              "Department",
              "Function /HandleUpdate",
              err.response.data.message,
              userID
            )
            try {
    
              const request = axios.post('/log',submitLogs.getLogs())
              const response =  request.data
              console.log(response)
    
            } catch ( err ) {
    
              const logStatus = err.code
    
              if( logStatus.includes("ERR_NETWOR") ) {
    
                const submitLogs = new Logs(
                  "DB",
                  "Asset Status",
                  "Function /HandleSubmit",
                  err,
                  userID
                )
    
                alert( submitLogs.getMessage() )
                console.log( submitLogs.getLogs() )
    
              }
    
              if( logStatus.includes("ERR_BAD_REQUEST") ) {
    
                const submitLogs = new Logs(
                  "Error",
                  "Asset Status",
                  "Function /HandleSubmit",
                  err.response.data.message,
                  userID
                )
                
                alert( submitLogs.getMessage() )
                console.log( submitLogs.getLogs() )
    
              }
    
            }

        }});
    }

    }
    catch (err) {
      alert(err)
    }
}

  return (

    <Stack>
      <FormControl>
      <Card>
        <Box>
          <FormLabel fontSize={{ base: "sm" }}>Department Name </FormLabel>
          <Input id='departmentname' label="Department name" placeholder="Department Name" 
          value={values.departmentname}
          onChange={ e => {
            setDepartments( { ...values, departmentname: e.target.value } )}}
          />    
        </Box>
        <Box>
          <FormLabel fontSize={{ base: "sm" }}>Description:  </FormLabel>
          <Input id='description' label="Description" placeholder="Description" 
          value={values.description}
          onChange={ e => {
            setDepartments( { ...values, description: e.target.value } )}}
          />    
        </Box>
        <Box>
        <Button colorScheme="green" onClick={handleUpdate}>
          {/* <Link
              to={{
              pathname: "/admin/assetstatusviewer"
              }}>
          </Link> */}
          {btnstate}

        </Button>
      </Box>
      </Card>
      </FormControl>
    </Stack>

  );

}

export default Department
