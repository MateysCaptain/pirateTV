import { React, useState, useEffect } from 'react';
import { Accordion, OptForm } from '../components';
import axios from 'axios';

export function FaqsContainer() {
  const [ faqs, setFaqs ] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`https://mateys.xyz/web_api/admin/getFaq.php`, {
            headers: {
                'accept': 'application/json', // Set the content type for FormData
            },
        });

        const data = response.data;

        // console.log(data);
        setFaqs(data);
    }

    fetchData();
  }, []);

  return (
    <Accordion>
      <Accordion.Title>Frequently Asked Questions</Accordion.Title>
      <Accordion.Frame>
        {faqs.map((item) => (
          <Accordion.Item key={item.id}>
            <Accordion.Header>{item.question}</Accordion.Header>
            <Accordion.Body>{item.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion.Frame>
    </Accordion>
  );
}
