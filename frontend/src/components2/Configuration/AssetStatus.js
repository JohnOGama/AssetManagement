
/* 

    Date : 10 / 16 / 23
    Author : Nole
    Activities
    Purpose : 
      Create AssetStatus.js

      import { Link as Anchor } from 'react-router-dom'
      

*/

import { Link as Anchor } from 'react-router-dom'


import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Stack,
  } from "@chakra-ui/react";
  import { Button, ButtonGroup } from "@chakra-ui/react";
  import { useState } from "react";
  import Modal1 from "components2/Modal/Modal";
  import Card from "components/Card/Card";
  import FourGraphs from "components/FourGraphs/FourGraphs";
  
  export default function AssetStatus() {
    const [editItem, setEditItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newItem, setNewItem] = useState({ categoryName: "", description: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [data, setData] = useState([
      { id: 1, categoryName: "Accessories", description: "Accessories" },
      { id: 2, categoryName: "Consumables", description: "Consumables" },
      { id: 3, categoryName: "Hardware", description: "Hardware" },
      { id: 4, categoryName: "Software", description: "Software" },
    ]);
    const handleEdit = (item) => {
      setEditItem(item);
      setIsEditing(true);
    };
    const handleCreate = () => {
      //setIsCreating(true);

      window.location.href = "/#/admin/_assetstatus"


    };
    const handleSave = (updatedData) => {
      const updatedArray = data.map((item) =>
        item.id === updatedData.id ? updatedData : item
      );
      setData(updatedArray);
      setIsEditing(false);
    };
    const handleDelete = (id) => {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
    };
    const handleCloseModal = () => {
      setIsCreating(false);
      setIsEditing(false);
      setNewItem({ categoryName: "", description: "" });
      setEditItem(null);
    };
    const handleSave1 = () => {
      const newId = data.length + 1;
      const newData = { id: newId, ...newItem };
      setData([...data, newData]);
      setIsCreating(false);
      setNewItem({ categoryName: "", description: "" });
    };
  
    console.log(editItem?.categoryName);
    console.log("data", data);
    if (isCreating) {
      console.log("creating");
    }
    if (isEditing) {
      console.log("editing");
    }
    return (
      <>
        <Stack mt={100}>
          <FourGraphs />
          <Card>
            <TableContainer>
              <Button colorScheme="green" onClick={handleCreate}>
                Create
              </Button>
              <Table size="lg">
                <Thead>
                  <Tr>
                    <Th>Actions</Th>
                    <Th>Category Name</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item) => (
                    <Tr key={item.id}>
                      <Td>
                        <ButtonGroup>
                          <Button
                            colorScheme="red"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            colorScheme="blue"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                        </ButtonGroup>
                      </Td>
                      <Td>{item.categoryName}</Td>
                      <Td>{item.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Modal1
                isCreating={isCreating}
                isEditing={isEditing}
                handleCloseModal={handleCloseModal}
                editItem={editItem}
                newItem={newItem}
                setNewItem={setNewItem}
                setEditItem={setEditItem}
                handleSave={handleSave}
                handleSave1={handleSave1}
              />
            </TableContainer>
          </Card>
        </Stack>
      </>
    );
  }
  