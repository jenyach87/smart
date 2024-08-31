import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/usersSlice';
import { RootState, AppDispatch } from '../../redux/store';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const UserTable: React.FC = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const userStatus = useSelector((state: RootState) => state.users.status);
  const error = useSelector((state: RootState) => state.users.error);

  const [filters, setFilters] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });

  React.useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  if (userStatus === 'loading') {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography className='flex justify-center items-center my-52 h-screen font-black'>{`${error} Something went wrong`}</Typography>;
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleClearFilter = (fieldName: keyof typeof filters) => {
    setFilters({
      ...filters,
      [fieldName]: '',
    });
  };

  const filteredUsers = users.filter((user) => {
    const { firstname, lastname, email, phone } = filters;
    return (
      user.firstname.toLowerCase().includes(firstname.toLowerCase()) &&
      user.lastname.toLowerCase().includes(lastname.toLowerCase()) &&
      user.email.toLowerCase().includes(email.toLowerCase()) &&
      user.phone.toLowerCase().includes(phone.toLowerCase())
    );
  });

  return (
    <>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2, boxShadow: 3, display: 'flex', gap: 3, background: '#e3e35f' }}>
          {['firstname', 'lastname', 'email', 'phone'].map((field) => (
            <TextField
              key={field}
              label={`Filter by ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              name={field}
              value={filters[field as keyof typeof filters]}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              sx={{ flex: 1, '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'blue'} }}
              InputProps={{
                endAdornment: filters[field as keyof typeof filters] ? (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClearFilter(field as keyof typeof filters)}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          ))}
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 1200, margin: '20px auto', boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Lastname</TableCell>
              <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ width: '25%' }}>{user.firstname}</TableCell>
                <TableCell sx={{ width: '25%' }}>{user.lastname}</TableCell>
                <TableCell sx={{ width: '25%' }}>{user.email}</TableCell>
                <TableCell sx={{ width: '25%' }}>{user.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserTable;
