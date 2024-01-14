import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './components/Dashboard/Dashboard'
import { DateTimePicker } from '@mantine/dates'
import { MantineProvider } from '@mantine/core'
import './index.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    // <Dashboard />
    <MantineProvider>
      <Dashboard />
    </MantineProvider>
  // </React.StrictMode>,
)
