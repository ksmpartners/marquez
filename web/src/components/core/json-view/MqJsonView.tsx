// SPDX-License-Identifier: Apache-2.0
import { Box } from '@mui/system'
import { THEME_EXTRA, theme } from '../../../helpers/theme'
import { githubDarkTheme } from '@uiw/react-json-view/githubDark'
import JsonView from '@uiw/react-json-view'
import React from 'react'

interface OwnProps {
  data: object
}

type JsonViewProps = OwnProps

githubDarkTheme.background = theme.palette.background.default
githubDarkTheme.backgroundColor = theme.palette.background.default
githubDarkTheme.borderLeftWidth = 2
githubDarkTheme.borderLeftColor = theme.palette.grey[500]
githubDarkTheme.borderLeftStyle = 'dashed'

const mqTheme = {
  ...githubDarkTheme,
  '--w-rjv-info-color': THEME_EXTRA.typography.subdued,
  '--w-rjv-type-null-color': theme.palette.warning.main,
  '--w-rjv-type-boolean-color': theme.palette.error.main,
  '--w-rjv-copied-color': theme.palette.primary.main,
  '--w-rjv-key-string': theme.palette.common.white,
  '--w-rjv-type-string-color': theme.palette.info.main,
  '--w-rjv-ellipsis-color': theme.palette.info.main,
  '--w-rjv-key-number': theme.palette.primary.main,
  '--w-rjv-type-float-color': theme.palette.primary.main,
}

// checking to see if the value is a URL type
function isURL(value: any): value is URL {
  return typeof value === 'object' && value instanceof URL && 'href' in value;
}

// method to update data prop and convert strings that begin with http to a URL type
function convertStringsToUrls(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertStringsToUrls);
  }

  if (obj && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' && value.startsWith('http')) {
        try {
          newObj[key] = new URL(value);
        } catch {
          newObj[key] = value;
        }
      } else {
        newObj[key] = convertStringsToUrls(value);
      }
    }
    return newObj;
  }

  return obj;
}

const MqJsonView: React.FC<JsonViewProps> = ({ data }) => {
  const processedData = convertStringsToUrls(data)

  return (
    // <Box my={2}>
    //   <JsonView
    //    style={mqTheme} collapsed={2} value={data} 
    //    />
    // </Box>
 <Box my={2}>
      <JsonView value={processedData} collapsed={2} style={mqTheme}>
        <JsonView.Url
          render={(props, { type, value }) => {
            if (type === 'value' && isURL(value)) {
              return (
                <a href={value.href} target="_blank" rel="noopener noreferrer" {...props}>
                  {value.href}
                </a>
              );
            }
            return undefined;
          }}
        />
      </JsonView>
    </Box>
  )
}

export default MqJsonView
