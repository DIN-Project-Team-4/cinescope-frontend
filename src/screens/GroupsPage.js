import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import '../index.css'
import './GroupsPage.css';

const GroupsPage = ({ groupId }) => {
    const [group, setGroup] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null); // Holds the currently selected group
    const [showModal, setShowModal] = useState(false); // Controls modal visibility

    const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
 

    const handleCardClick = (group) => {
        setSelectedGroup(group);
        setShowModal(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setSelectedGroup(null);
        setShowModal(false);
    }; 

    // Function to handle joining a group
    const handleJoinGroup = () => {
        if (selectedGroup) {
            fetch(`${process.env.REACT_APP_API_URL}/groups/${selectedGroup.group_id}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    groupId : selectedGroup.group_id,
                    userId : userData.userId
                 })
            })
                .then((response) => {
                    if (response.ok) {
                        alert(`Sent application request to: ${selectedGroup.name}. Good luck!`);
                    } else {
                        alert('You have already sent an applicantion.');
                    }
                })
                .catch((error) => {
                    console.error('Error joining group:', error);
                    alert('An error occurred while joining the group.');
                });
        }
        handleCloseModal();
    };

    useEffect(() => {
        // Fetch groups from the backend
        fetch(`${process.env.REACT_APP_API_URL}/groups/all`)
            .then((response) => response.json())
            .then((data) => setGroup(data));
    }, [groupId]);

    if (!group) return <div>Loading...</div>;
    console.log(group);

    return (
        <div>
            <Container fluid className='main-div'>

                <Row className="d-flex justify-content-between align-items-center">

                    <Col>
                        <div className='div-title'>All Groups</div>
                    </Col>
                </Row>

                <Row>
                    {group.map((group) => (
                        <Col md={4} key={group.id} className="mb-4">
                            <Card bg="dark" onClick={() => handleCardClick(group)} style={{ cursor: 'pointer' }} className='group-item'>
                                <Card.Body>
                                    <Card.Title>{group.name}</Card.Title>
                                    <Card.Text>{group.group_description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Modal for group details */}
            {selectedGroup && (
                <Modal show={showModal} onHide={handleCloseModal} className='dark_modal'>
                    <Modal.Header className='bg-dark text-white' closeButton>
                        <Modal.Title>{selectedGroup.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='bg-dark text-white'>
                        <p>{selectedGroup.group_description}</p>
                        <Button variant="outline-secondary" onClick={handleJoinGroup}>
                            Join Group
                        </Button>
                    </Modal.Body>
                </Modal>
            )}

            </Container>
        </div>
    );
};

export default GroupsPage;