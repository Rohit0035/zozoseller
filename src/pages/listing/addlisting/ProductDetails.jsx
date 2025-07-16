import React, { useState } from 'react';
import {
    Accordion, AccordionItem, AccordionHeader, AccordionBody,
    Card, CardBody, Row, Col, Label, Input,
    Form,
    InputGroup,
    Button
} from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { FaSearch, FaPlus, FaMinus } from 'react-icons/fa';

const ProductDetails = () => {
    const [open, setOpen] = useState('');
    const [inputs, setInputs] = useState(['']);


    const toggle = (id) => {
        setOpen(open === id ? '' : id);
    };

    const handleAddInput = () => {
        setInputs([...inputs, '']);
    };

    const handleRemoveInput = (index) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
    };

    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };


    return (
        <div>
            <Accordion open={open} toggle={toggle}>
                <AccordionItem className="border-0 shadow-sm mb-1">
                    <AccordionHeader targetId="1">
                        Price, Stock and Shipping Information (0/20)
                    </AccordionHeader>
                    <AccordionBody accordionId="1">
                        <div style={{ height: '250px', overflow: 'hidden' }}>
                            <PerfectScrollbar options={{ suppressScrollX: true }}>
                                <Form>
                                    <Row className="mb-3">
                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>* Mandatory fields</Label>
                                            <small className='d-block' style={{ fontSize: '12px' }}>
                                                Don't want to fill these attributes? You can copy the values from one of your old SKUs!
                                                Enter the SKU ID you want to copy attribute values
                                            </small>
                                            <InputGroup className='mt-1'>
                                                <span className='me-1'>From:</span>
                                                <Input type='search' placeholder='Search for SKU ID' />
                                                <span className='p-2 border' style={{ cursor: 'pointer' }}><FaSearch /></span>
                                            </InputGroup>
                                        </Col>
                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Listing information</Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className=' st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Seller SKU ID *</span>
                                                <Input type='search' placeholder='Search for SKU ID' />
                                            </InputGroup>
                                        </Col>
                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Status Details</Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Listing Status*</span>
                                                <Input type="select" name="category" id="categorySelect">
                                                    <option value="">-- Select One --</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </Input>
                                            </InputGroup>
                                        </Col>
                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Price details</Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>MRP*</span>
                                                <Input type='number' placeholder='' />
                                                <span className='px-1 py-2'>INR</span>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Your selling price*</span>
                                                <Input type='number' placeholder='' />
                                                <span className='px-1 py-2'>INR</span>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Quantity (MinOQ)*</span>
                                                <Input type="select" name="category" id="categorySelect">
                                                    <option value="">-- Select One --</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                </Input>
                                            </InputGroup>
                                        </Col>

                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Inventory details</Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Fullfilment by *</span>
                                                <Input type="select" name="category" id="categorySelect">
                                                    <option value="">-- Select One --</option>
                                                    <option value="seller">Seller</option>
                                                </Input>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Procurement type</span>
                                                <Input type="select" name="category" id="categorySelect">
                                                    <option value="">-- Select One --</option>
                                                    <option value="instock">Instock</option>
                                                    <option value="express">Express</option>
                                                </Input>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Procurement SLA *</span>
                                                <Input type='text' placeholder='' />
                                                <span className='px-1 py-2'>DAY</span>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='  st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Stock *</span>
                                                <Input type='number' placeholder='' />
                                            </InputGroup>
                                            <small className='ms-auto'>Minimum 5 quantity required for listing visibility
                                            </small>
                                        </Col>

                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Shipping provider</Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Shipping provider*</span>
                                                <Input type="select" name="category" id="categorySelect">
                                                    <option value="">-- Select One --</option>
                                                    <option value="flipkart">Flipkart</option>
                                                </Input>
                                            </InputGroup>
                                        </Col>

                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Package details</Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Length *</span>
                                                <Input type='text' placeholder='' />
                                                <span className='px-1 py-2'>CM
                                                </span>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Breadth *</span>
                                                <Input type='text' placeholder='' />
                                                <span className='px-1 py-2'>CM</span>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Height *</span>
                                                <Input type='text' placeholder='' />
                                                <span className='px-1 py-2'>CM</span>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Weight *</span>
                                                <Input type='text' placeholder='' />
                                                <span className='px-1 py-2'>KG</span>
                                            </InputGroup>
                                        </Col>

                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Tax details</Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>HSN *</span>
                                                <Input type="text" name="">

                                                </Input>
                                            </InputGroup>
                                            <small>Find relevant HSN codes</small>

                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Luxury Cess</span>
                                                <Input type="text" />
                                                <span className='px-1 py-2'>PERCENTAGE</span>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Tax Code *</span>
                                                <Input type="select" name="category" id="categorySelect">
                                                    <option value="">-- Select One --</option>
                                                    <option>Select One</option>
                                                    <option value="GST_0">GST_0</option>
                                                    <option value="GST_12">GST_12</option>
                                                    <option value="GST_18">GST_18</option>
                                                    <option value="GST_28">GST_28</option>
                                                    <option value="GST_3">GST_3</option>
                                                    <option value="GST_5">GST_5</option>
                                                    <option value="GST_APPAREL">GST_APPAREL</option>
                                                </Input>
                                            </InputGroup>
                                        </Col>

                                        <Col sm={12} className='mb-3'>
                                            <Label className='mb-1'>Manufacturing Details
                                            </Label>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Country Of Origin*</span>
                                                <Input type="select" name="category" id="categorySelect">
                                                    <option>Select One</option>
                                                    <option value="AF">Afghanistan</option>
                                                    <option value="AX">Aland Islands</option>
                                                    <option value="AL">Albania</option>
                                                    <option value="DZ">Algeria</option>
                                                    <option value="AS">American Samoa</option>
                                                    <option value="AD">Andorra</option>
                                                    <option value="AO">Angola</option>
                                                    <option value="AI">Anguilla</option>
                                                    <option value="AQ">Antarctica</option>
                                                    <option value="AG">Antigua and Barbuda</option>
                                                    <option value="AR">Argentina</option>
                                                    <option value="AM">Armenia</option>
                                                    <option value="AW">Aruba</option>
                                                    <option value="AU">Australia</option>
                                                    <option value="AT">Austria</option>
                                                    <option value="AZ">Azerbaijan</option>
                                                    <option value="BS">Bahamas</option>
                                                    <option value="BH">Bahrain</option>
                                                    <option value="BD">Bangladesh</option>
                                                    <option value="BB">Barbados</option>
                                                    <option value="BY">Belarus</option>
                                                    <option value="BE">Belgium</option>
                                                    <option value="BZ">Belize</option>
                                                    <option value="BJ">Benin</option>
                                                    <option value="BM">Bermuda</option>
                                                    <option value="BT">Bhutan</option>
                                                    <option value="BO">Bolivia</option>
                                                    <option value="BA">Bosnia and Herzegovina</option>
                                                    <option value="BW">Botswana</option>
                                                    <option value="BV">Bouvet Island</option>
                                                    <option value="BR">Brazil</option>
                                                    <option value="IO">British Indian Ocean Territory</option>
                                                    <option value="VG">British Virgin Islands</option>
                                                    <option value="BN">Brunei Darussalam</option>
                                                    <option value="BG">Bulgaria</option>
                                                    <option value="BF">Burkina Faso</option>
                                                    <option value="BI">Burundi</option>
                                                    <option value="KH">Cambodia</option>
                                                    <option value="CM">Cameroon</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="CV">Cape Verde</option>
                                                    <option value="KY">Cayman Islands</option>
                                                    <option value="CF">Central African Republic</option>
                                                    <option value="TD">Chad</option>
                                                    <option value="CL">Chile</option>
                                                    <option value="CN">China</option>
                                                    <option value="CX">Christmas Island</option>
                                                    <option value="CC">Cocos (Keeling) Islands</option>
                                                    <option value="CO">Colombia</option>
                                                    <option value="KM">Comoros</option>
                                                    <option value="CG">Congo (Brazzaville)</option>
                                                    <option value="CD">Congo, (Kinshasa)</option>
                                                    <option value="CK">Cook Islands</option>
                                                    <option value="CR">Costa Rica</option>
                                                    <option value="HR">Croatia</option>
                                                    <option value="CU">Cuba</option>
                                                    <option value="CY">Cyprus</option>
                                                    <option value="CZ">Czech Republic</option>
                                                    <option value="CI">Côte d'Ivoire</option>
                                                    <option value="DK">Denmark</option>
                                                    <option value="DJ">Djibouti</option>
                                                    <option value="DM">Dominica</option>
                                                    <option value="DO">Dominican Republic</option>
                                                    <option value="EC">Ecuador</option>
                                                    <option value="EG">Egypt</option>
                                                    <option value="SV">El Salvador</option>
                                                    <option value="GQ">Equatorial Guinea</option>
                                                    <option value="ER">Eritrea</option>
                                                    <option value="EE">Estonia</option>
                                                    <option value="ET">Ethiopia</option>
                                                    <option value="FK">Falkland Islands (Malvinas)</option>
                                                    <option value="FO">Faroe Islands</option>
                                                    <option value="FJ">Fiji</option>
                                                    <option value="FI">Finland</option>
                                                    <option value="FR">France</option>
                                                    <option value="GF">French Guiana</option>
                                                    <option value="PF">French Polynesia</option>
                                                    <option value="TF">French Southern Territories</option>
                                                    <option value="GA">Gabon</option>
                                                    <option value="GM">Gambia</option>
                                                    <option value="GE">Georgia</option>
                                                    <option value="DE">Germany</option>
                                                    <option value="GH">Ghana</option>
                                                    <option value="GI">Gibraltar</option>
                                                    <option value="GR">Greece</option>
                                                    <option value="GL">Greenland</option>
                                                    <option value="GD">Grenada</option>
                                                    <option value="GP">Guadeloupe</option>
                                                    <option value="GU">Guam</option>
                                                    <option value="GT">Guatemala</option>
                                                    <option value="GG">Guernsey</option>
                                                    <option value="GN">Guinea</option>
                                                    <option value="GW">Guinea-Bissau</option>
                                                    <option value="GY">Guyana</option>
                                                    <option value="HT">Haiti</option>
                                                    <option value="HM">Heard and Mcdonald Islands</option>
                                                    <option value="VA">Holy See (Vatican City State)</option>
                                                    <option value="HN">Honduras</option>
                                                    <option value="HK">Hong Kong, SAR China</option>
                                                    <option value="HU">Hungary</option>
                                                    <option value="IS">Iceland</option>
                                                    <option value="IN">India</option>
                                                    <option value="ID">Indonesia</option>
                                                    <option value="IR">Iran</option>
                                                    <option value="IQ">Iraq</option>
                                                    <option value="IE">Ireland</option>
                                                    <option value="IM">Isle of Man</option>
                                                    <option value="IL">Israel</option>
                                                    <option value="IT">Italy</option>
                                                    <option value="JM">Jamaica</option>
                                                    <option value="JP">Japan</option>
                                                    <option value="JE">Jersey</option>
                                                    <option value="JO">Jordan</option>
                                                    <option value="KZ">Kazakhstan</option>
                                                    <option value="KE">Kenya</option>
                                                    <option value="KI">Kiribati</option>
                                                    <option value="KP">Korea (North)</option>
                                                    <option value="KR">Korea (South)</option>
                                                    <option value="KW">Kuwait</option>
                                                    <option value="KG">Kyrgyzstan</option>
                                                    <option value="LA">Lao PDR</option>
                                                    <option value="LV">Latvia</option>
                                                    <option value="LB">Lebanon</option>
                                                    <option value="LS">Lesotho</option>
                                                    <option value="LR">Liberia</option>
                                                    <option value="LY">Libya</option>
                                                    <option value="LI">Liechtenstein</option>
                                                    <option value="LT">Lithuania</option>
                                                    <option value="LU">Luxembourg</option>
                                                    <option value="MO">Macao, SAR China</option>
                                                    <option value="MK">Macedonia</option>
                                                    <option value="MG">Madagascar</option>
                                                    <option value="MW">Malawi</option>
                                                    <option value="MY">Malaysia</option>
                                                    <option value="MV">Maldives</option>
                                                    <option value="ML">Mali</option>
                                                    <option value="MT">Malta</option>
                                                    <option value="MH">Marshall Islands</option>
                                                    <option value="MQ">Martinique</option>
                                                    <option value="MR">Mauritania</option>
                                                    <option value="MU">Mauritius</option>
                                                    <option value="YT">Mayotte</option>
                                                    <option value="MX">Mexico</option>
                                                    <option value="FM">Micronesia</option>
                                                    <option value="MD">Moldova</option>
                                                    <option value="MC">Monaco</option>
                                                    <option value="MN">Mongolia</option>
                                                    <option value="ME">Montenegro</option>
                                                    <option value="MS">Montserrat</option>
                                                    <option value="MA">Morocco</option>
                                                    <option value="MZ">Mozambique</option>
                                                    <option value="MM">Myanmar</option>
                                                    <option value="NA">Namibia</option>
                                                    <option value="NR">Nauru</option>
                                                    <option value="NP">Nepal</option>
                                                    <option value="NL">Netherlands</option>
                                                    <option value="AN">Netherlands Antilles</option>
                                                    <option value="NC">New Caledonia</option>
                                                    <option value="NZ">New Zealand</option>
                                                    <option value="NI">Nicaragua</option>
                                                    <option value="NE">Niger</option>
                                                    <option value="NG">Nigeria</option>
                                                    <option value="NU">Niue</option>
                                                    <option value="NF">Norfolk Island</option>
                                                    <option value="MP">Northern Mariana Islands</option>
                                                    <option value="NO">Norway</option>
                                                    <option value="OM">Oman</option>
                                                    <option value="PK">Pakistan</option>
                                                    <option value="PW">Palau</option>
                                                    <option value="PS">Palestinian Territory</option>
                                                    <option value="PA">Panama</option>
                                                    <option value="PG">Papua New Guinea</option>
                                                    <option value="PY">Paraguay</option>
                                                    <option value="PE">Peru</option>
                                                    <option value="PH">Philippines</option>
                                                    <option value="PN">Pitcairn</option>
                                                    <option value="PL">Poland</option>
                                                    <option value="PT">Portugal</option>
                                                    <option value="PR">Puerto Rico</option>
                                                    <option value="QA">Qatar</option>
                                                    <option value="RO">Romania</option>
                                                    <option value="RU">Russian Federation</option>
                                                    <option value="RW">Rwanda</option>
                                                    <option value="RE">Réunion</option>
                                                    <option value="SH">Saint Helena</option>
                                                    <option value="KN">Saint Kitts and Nevis</option>
                                                    <option value="LC">Saint Lucia</option>
                                                    <option value="PM">Saint Pierre and Miquelon</option>
                                                    <option value="VC">Saint Vincent and Grenadines</option>
                                                    <option value="BL">Saint-Barthélemy</option>
                                                    <option value="MF">Saint-Martin (French part)</option>
                                                    <option value="WS">Samoa</option>
                                                    <option value="SM">San Marino</option>
                                                    <option value="ST">Sao Tome and Principe</option>
                                                    <option value="SA">Saudi Arabia</option>
                                                    <option value="SN">Senegal</option>
                                                    <option value="RS">Serbia</option>
                                                    <option value="SC">Seychelles</option>
                                                    <option value="SL">Sierra Leone</option>
                                                    <option value="SG">Singapore</option>
                                                    <option value="SK">Slovakia</option>
                                                    <option value="SI">Slovenia</option>
                                                    <option value="SB">Solomon Islands</option>
                                                    <option value="SO">Somalia</option>
                                                    <option value="ZA">South Africa</option>
                                                    <option value="GS">South Georgia and the South Sandwich Islands</option>
                                                    <option value="SS">South Sudan</option>
                                                    <option value="ES">Spain</option>
                                                    <option value="LK">Sri Lanka</option>
                                                    <option value="SD">Sudan</option>
                                                    <option value="SR">Suriname</option>
                                                    <option value="SJ">Svalbard and Jan Mayen Islands</option>
                                                    <option value="SZ">Swaziland</option>
                                                    <option value="SE">Sweden</option>
                                                    <option value="CH">Switzerland</option>
                                                    <option value="SY">Syrian Arab Republic (Syria)</option>
                                                    <option value="TW">Taiwan</option>
                                                    <option value="TJ">Tajikistan</option>
                                                    <option value="TZ">Tanzania</option>
                                                    <option value="TH">Thailand</option>
                                                    <option value="TL">Timor-Leste</option>
                                                    <option value="TG">Togo</option>
                                                    <option value="TK">Tokelau</option>
                                                    <option value="TO">Tonga</option>
                                                    <option value="TT">Trinidad and Tobago</option>
                                                    <option value="TN">Tunisia</option>
                                                    <option value="TR">Turkey</option>
                                                    <option value="TM">Turkmenistan</option>
                                                    <option value="TC">Turks and Caicos Islands</option>
                                                    <option value="TV">Tuvalu</option>
                                                    <option value="UM">US Minor Outlying Islands</option>
                                                    <option value="UG">Uganda</option>
                                                    <option value="UA">Ukraine</option>
                                                    <option value="AE">United Arab Emirates</option>
                                                    <option value="GB">United Kingdom</option>
                                                    <option value="US">United States of America</option>
                                                    <option value="UY">Uruguay</option>
                                                    <option value="UZ">Uzbekistan</option>
                                                    <option value="VU">Vanuatu</option>
                                                    <option value="VE">Venezuela (Bolivarian Republic)</option>
                                                    <option value="VN">Viet Nam</option>
                                                    <option value="VI">Virgin Islands, US</option>
                                                    <option value="WF">Wallis and Futuna Islands</option>
                                                    <option value="EH">Western Sahara</option>
                                                    <option value="YE">Yemen</option>
                                                    <option value="ZM">Zambia</option>
                                                    <option value="ZW">Zimbabwe</option>
                                                </Input>
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Manufacturer Details *</span>
                                                <Input type="text" />
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Packer Details*</span>
                                                <Input type="text" />
                                            </InputGroup>
                                            <InputGroup className='mt-1'>
                                                <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Importer Details*</span>
                                                <Input type="text" />
                                            </InputGroup>
                                        </Col>
                                        <Col sm={12} className='mb-3'>
                                            <Button className="btn btn-primary btn-sm">Save</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </PerfectScrollbar>
                        </div>
                    </AccordionBody>
                </AccordionItem>

                {/* Section 2 */}
                <AccordionItem className="border-0 shadow-sm mb-1">
                    <AccordionHeader targetId="2">
                        Product Description (0/11)
                    </AccordionHeader>
                    <AccordionBody accordionId="2">
                        <Row>
                            <Col sm={12} className='mb-3'>
                                <Label className='mb-1'>* Mandatory fields</Label>
                                <InputGroup className='mt-1'>
                                    <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Model Number*</span>
                                    <Input type="text" />
                                </InputGroup>
                                <InputGroup className='mt-1'>
                                    <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Vehicle Brand*</span>
                                    <Input type="select" name="category" id="categorySelect">
                                        <option value="">-- Select One --</option>
                                        <option value=""></option>
                                    </Input>
                                </InputGroup>
                                <InputGroup className='mt-1'>
                                    <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Vehicle Model Name*</span>
                                    <Input type="select" name="category" id="categorySelect">
                                        <option value="">-- Select One --</option>
                                        <option value=""></option>
                                    </Input>
                                </InputGroup>
                                <InputGroup className='mt-1'>
                                    <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Vehicle Model Year*</span>
                                    <Input type="select" name="category" id="categorySelect">
                                        <option value="">-- Select One --</option>
                                        <option value=""></option>
                                    </Input>
                                </InputGroup>
                                <InputGroup className='mt-1'>
                                    <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Weight*</span>
                                    <Input type="text" />
                                    <Input type="select" name="category" id="categorySelect">
                                        <option value="">-- Select One --</option>
                                        <option value="">G</option>
                                        <option value="">KG</option>

                                    </Input>
                                </InputGroup>
                            </Col>
                            <Col sm={12} className='mb-3'>
                                <Button className="btn btn-primary btn-sm">Save</Button>
                            </Col>
                        </Row>
                    </AccordionBody>
                </AccordionItem>

                {/* Section 3 */}
                <AccordionItem className="border-0 shadow-sm mb-1">
                    <AccordionHeader targetId="3">
                        Additional Description (Optional) (0/17)
                    </AccordionHeader>
                    <AccordionBody accordionId="3">
                        <Row className="mb-3">
                            <Col sm={12} className='mb-3'>
                                <Label className='mb-1'>General</Label>
                                <InputGroup className='mt-1'>
                                    <span style={{ fontSize: '14px' }} className='st-int-span me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7'>Description
                                        *</span>
                                    {/* <Input type="select" name="category" id="categorySelect">
                                                    <option value="">-- Select One --</option>
                                                    <option value="flipkart">Flipkart</option>
                                                </Input> */}
                                    <Input type='text' />
                                </InputGroup>
                            </Col>
                            <Col sm={12} className='mb-3'>
                                <Label className='mb-1'>General</Label>
                                <Row className="mb-3">
                                    <div className="col-4">
                                        <span
                                            style={{ fontSize: '14px' }}
                                            className="d-block w-100 me-1 bg-secondary bg-opacity-10 px-1 py-2 fs-7"
                                        >
                                            Description *
                                        </span>
                                    </div>

                                    <div className="col-8">
                                        {inputs.map((value, index) => (
                                            <div className="d-flex align-items-center mb-2" key={index}>
                                                <Input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                                    className="me-2"
                                                />
                                                <Button
                                                    color="success"
                                                    size="sm"
                                                    className="me-1"
                                                    onClick={handleAddInput}
                                                >
                                                    <FaPlus />
                                                </Button>
                                                {inputs.length > 1 && (
                                                    <Button
                                                        color="danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveInput(index)}
                                                    >
                                                        <FaMinus />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ProductDetails;

