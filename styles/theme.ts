import { extendTheme } from '@chakra-ui/react'
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

export const theme = extendTheme({
  breakPoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'full'
      },
      variants: {
        'outline': {
          border: '1px solid gray.200',
          boxShadow: 'none'
        },
        'icon': {
          borderRadius: 'full'
        },
        'transparent': {
          background: 'none',
          border: 'none',
          boxShadow: 'none'

        }
      },
      defaultProps: {
        colorScheme: 'brand'
      }
    },
    Checkbox: {
      baseStyle: {
        container: {
          w: 'full'
        },
        label: {
          fontSize: 'sm'
        }
      },
      defaultProps: {
        colorScheme: 'brand'
      },
    },
    Link: {
      baseStyle: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
        },
        _focus: {
          textDecoration: 'none',
        },
        _visited: {
          textDecoration: 'none',
        },
        _active: {
          textDecoration: 'none',
        },
      },
    },
    Heading: {
      variants: {
        title: {
          fontSize: '36px',
          lineHeight: '40px',
          fontWeight: 800
        },
        subtitle: {
          fontSize: '24px',
          lineHeight: '32px',
          fontWeight: 700
        },
        heading1: {
          fontSize: '20px',
          lineHeight: '28px',
          fontWeight: 700
        },
        heading2: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 600
        },
        heading3: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 500
        },
        heading4: {
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 700
        }
      }
    },
    Icon: {
      baseStyle: {
        w: '10',
        h: '10'
      },
      defaultProps: {
        w: '10',
        h: '10'
      }
    },
    Image: {
      baseStyle: {
        _focus: {
          outline: 'none'
        }
      }
    },
    Input: {
      defaultProps: {
        borderColor: 'gray.200',
        focusBorderColor: 'brand.black'
      }
    },
    Text: {
      variants: {
        text: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 400,
        },
        'text-sm': {
          fontSize: '12px',
          lineHeight: '20px',
          fontWeight: 400,
        },
        subtitle1: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 500,
        },
        subtitle2: {
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 500,
        },
        button1: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 600,
        },
        button2: {
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 600,
        },
        caption: {
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: 400,
        },
        error: {
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: 500,
          color: 'red.500',
        }
      }
    }
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Montserrat',
    mono: 'Source Code Pro',
  },
  colors: {
    white: '#FFFFFF',
    black: '#000000',
    blue: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      300: '#93C5FD',
      500: '#3B82F6',
      600: '#2563EB',
    },
    brand: {
      50: '#F4F3FA',
      100: '#DFCCFA',
      200: '#BF9AF5',
      300: '#9365E3',
      400: '#BE94FF',
      500: '#CEAFFF',
      600: '#BE94FF',
      700: '#200675',
      800: '#16035E',
      900: '#0F024E',
      black: '#060F27',
    },
    secondary: {
      100: '#C9FBCB',
      500: '#02B14F',
      black: '#232323',
      accent: '#08C725',
    },
    gray: {
      100: '#F3F4F6',
      200: '#E5E7Eb',
      300: '#D1D5Db',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
    },
    green: {
      50: '#ECFDF5',
      300: '#6EE7B7',
      500: '#10B981',
    },
    orange: {
      50: '#FFF7ED',
      300: '#FDBA74',
      500: '#F97316',
    },
    red: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      300: '#FCA5A5',
      500: '#EF4444',
      900: '#7F1D1D',
    },
  },
  radii: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '4px',
    lg: '4px',
    xl: '4px',
    '2xl': '12px',
    '3xl': '14px',
    full: '9999px',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'white' : 'white'
      },
      h1: {
        color: props.colorMode === 'dark' ? 'brand.black' : 'brand.black'
      },
      h2: {
        color: props.colorMode === 'dark' ? 'brand.black' : 'brand.black'
      },
      h3: {
        color: props.colorMode === 'dark' ? 'brand.black' : 'brand.black'
      },
      h4: {
        color: props.colorMode === 'dark' ? 'brand.black' : 'brand.black'
      }
    })
  }
})
