export const getToastOptions = (theme: string | undefined) => ({
  style: {
    padding: '16px',
    background: theme === 'dark' ? '#ec1e25' : '',
    borderRadius: '100px',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 6px 45px',
    backdropFilter: 'blur(3px)',
    color: theme === 'dark' ? '#fff' : '',
    textShadow: 'rgba(17, 17, 17, 0.21) 0px 1px 12px',
  },
  success: {
    className: '!px-3 !bg-green-500 !text-white overflow-hidden',
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981'
    }
  },
  error: {
    className: '!px-3 !bg-red-500 !text-white overflow-hidden',
    iconTheme: {
      primary: '#fff',
      secondary: '#ec1e25'
    }
  },
  loading: {
    className: '!px-3 !bg-yellow-500 !text-white overflow-hidden',
    iconTheme: {
      primary: '#fff',
      secondary: 'rgba(230, 125, 0, 1)',
    },
  },
  reverseOrder: false,
  duration: 4000
})