import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Card,
    CardBody,
    Breadcrumb,
    BreadcrumbItem
} from 'reactstrap';
import { FaQuestionCircle } from 'react-icons/fa';

const faqData = [
    {
        id: '1',
        question: 'What is this Partner Services Network and how does it work?',
        answer:
            'Partner Services Network connects you to various quality service partners who can help you grow your business on Flipkart. You can discover service partners to avail services like product photography, cataloging, account management, advertising support, sourcing etc. Once you choose a service, you can contact the partner by raising a request. The partner will then contact you directly to begin the service.'
    },
    {
        id: '2',
        question: 'Who are the Partners listed under Partner Services Network?',
        answer:
            'Partners listed are third-party service providers selected to offer services to Flipkart sellers. Flipkart acts only as a facilitator, and sellers are responsible for agreeing service terms directly with the partners.'
    },
    {
        id: '3',
        question: 'Do I need to pay for the services?',
        answer:
            'Yes, these are paid services. Charges depend on the services chosen and must be paid directly to the service partner. Some partners may offer special rates or promotions at their discretion.'
    },
    {
        id: '4',
        question: 'What if I am dissatisfied with the service delivered by the partners?',
        answer:
            'You should agree on service quality before availing it. If dissatisfied, you can request a redo or refund from the partner per agreed terms. Flipkart encourages feedback and facilitates communication but isn’t responsible for service quality.'
    },
    {
        id: '5',
        question: 'How are Partner Ratings calculated?',
        answer:
            'After service completion, sellers can rate the partner. Overall ratings are calculated as a mix of individual service ratings over time.'
    }
];

const PartnerServicesHelp = () => {
    const [open, setOpen] = useState('');

    const toggle = id => setOpen(open === id ? '' : id);

    return (
        <>
            <Row>
                <Col md="12">
                    <Breadcrumb className='my-2'>
                        <BreadcrumbItem>
                            <h5> Help</h5>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            Partner Services
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Col>
            </Row>
            <Card className="border-0 shadow-sm">
                <CardBody>
                    <Row className="mb-4">
                        <Col className="d-flex align-items-center gap-2">
                            <FaQuestionCircle size={22} className="text-primary" />
                            <h5 className="mb-0">Partner Services Help</h5>
                        </Col>
                    </Row>

                    <Accordion open={open} toggle={toggle}>
                        {faqData.map(item => (
                            <AccordionItem key={item.id}>
                                <AccordionHeader targetId={item.id}>
                                    {item.question}
                                </AccordionHeader>
                                <AccordionBody accordionId={item.id}>
                                    {item.answer}
                                </AccordionBody>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardBody>
            </Card>
        </>
    );
};

export default PartnerServicesHelp;
