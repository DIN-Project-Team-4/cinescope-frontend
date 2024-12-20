import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

function GroupCreation() {
  const userData = JSON.parse(localStorage.getItem('userData'));  
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);

  // Form state to handle input values
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  // State to track loading or errors during API call
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to open the modal
  const handleShow = () => setShowModal(true);

  // Function to close the modal
  const handleClose = () => setShowModal(false);

  // Handle form submission
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Send POST request to the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/groups/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          ownerId: userData.userId, // Send owner_id along with group name
          group_description: groupDescription // Send group description along with group name
        }),
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      // Optionally handle the successful response (e.g., show a success message)
      const data = await response.json();
      console.log('Group Created:', data);

      // Close the modal after submission
      setShowModal(false);
      setGroupName(''); // Reset group name
      setGroupDescription(''); // Reset group description
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Error creating group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Button to trigger the modal */}
      <Button variant="dark" onClick={handleShow}>
        Create Group
      </Button>

      {/* Modal for group creation */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header className='bg-dark text-white' closeButton>
          <Modal.Title>Create a New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark text-white'>
          <Form onSubmit={handleCreateGroup}>
            <Form.Group controlId="formGroupName">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGroupDescription">
              <Form.Label>Group Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter group description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                required
              />
            </Form.Group>
            {error && <div className="text-danger mt-3">{error}</div>}
            <Button variant="outline-light" type="submit" className="mt-3" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default GroupCreation;

