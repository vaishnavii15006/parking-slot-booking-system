import React, { useEffect, useMemo, useState } from 'react';
import './SlotList.css';
import { getAvailableSlots } from '../utils/api';
import { 
 Container, 
 Grid, 
 Card, 
 CardContent, 
 Typography, 
 Button, 
 Box,
 FormControl,
 InputLabel,
 Select,
 MenuItem,
 Chip,
 Alert,
 CircularProgress,
 Paper,
 Pagination,
 ToggleButton,
 ToggleButtonGroup
} from '@mui/material';
import { 
 DirectionsCar, 
 Star, 
 Accessible, 
 LocalParking,
 FilterList
} from '@mui/icons-material';
import { useInRouterContext, useLocation } from 'react-router-dom';

export default function SlotList({ onSelect, selectedSlot }) {
 const [slots, setSlots] = useState([]);
 const [error, setError] = useState("");
 const [filter, setFilter] = useState("");
 const [loading, setLoading] = useState(false);
 const [sortBy, setSortBy] = useState('rate_asc');
 const [page, setPage] = useState(1);
 const pageSize = 4;
 const location = useLocation();

 const router = useInRouterContext();
 const userId = location?.state?.userId || 1;

 const load = async () => {
  setLoading(true);
  try {
   const data = await getAvailableSlots();
   setSlots(data);
  } catch (e) {
   setError("Failed to load slots. Please check your connection and try again.");
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  load();
 }, []);

 const displayed = useMemo(() => {
  let items = slots.filter(s => !filter || s.slotType === filter);
  items = items.sort((a, b) => {
   switch (sortBy) {
    case 'rate_desc':
     return b.hourlyRate - a.hourlyRate;
    case 'num_asc':
     return a.slotNumber - b.slotNumber;
    case 'num_desc':
     return b.slotNumber - a.slotNumber;
    case 'rate_asc':
    default:
     return a.hourlyRate - b.hourlyRate;
   }
  });
  return items;
 }, [slots, filter, sortBy]);

 const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize));
 const paged = useMemo(() => {
  const start = (page - 1) * pageSize;
  return displayed.slice(start, start + pageSize);
 }, [displayed, page]);

 useEffect(() => { setPage(1); }, [filter, sortBy]);

 

 const getSlotIcon = (slotType) => {
  switch (slotType) {
   case 'VIP':
    return <Star sx={{ color: '#ffd700' }} />;
   case 'Handicapped':
    return <Accessible sx={{ color: '#4caf50' }} />;
   default:
    return <LocalParking sx={{ color: '#2196f3' }} />;
  }
 };

 const getSlotColor = (slotType) => {
  switch (slotType) {
   case 'VIP':
    return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
   case 'Handicapped':
    return 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)';
   default:
    return 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)';
  }
 };

 return (
  <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
   {/* Hero Section */}
   <Box sx={{ 
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: 'white',
    py: 6,
    textAlign: 'center'
   }}>
    <Container maxWidth="lg">
     <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
      Available Parking Slots
     </Typography>
     <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
      Choose your preferred parking spot from our premium locations
     </Typography>
    </Container>
   </Box>

   <Container maxWidth="lg" sx={{ py: 6 }}>
    <Paper 
     elevation={3} 
     sx={{ 
      p: 4, 
      mb: 4, 
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: 3
     }}
    >
     <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
      <Box>
       <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Find Your Perfect Spot
       </Typography>
       <Typography variant="body1" color="text.secondary">
        Browse through our available parking slots and book instantly
       </Typography>
      </Box>
     </Box>

  
    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
     <FormControl fullWidth sx={{ maxWidth: 300 }}>
      <InputLabel id="filter-label">
       <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FilterList sx={{ mr: 1 }} />
        Filter by Type
       </Box>
      </InputLabel>
      <Select
       labelId="filter-label"
       data-testid="type-filter"
       value={filter}
       onChange={e => setFilter(e.target.value)}
       label="Filter by Type"
      >
       <MenuItem value="">All Types</MenuItem>
       <MenuItem value="Regular">Regular</MenuItem>
       <MenuItem value="VIP">VIP</MenuItem>
       <MenuItem value="Handicapped">Handicapped</MenuItem>
      </Select>
     </FormControl>
     <Box>
      <Typography variant="body2" sx={{ mb: 0.5 }}>Sort</Typography>
      <ToggleButtonGroup size="small" value={sortBy} exclusive onChange={(e, v) => v && setSortBy(v)}>
       <ToggleButton value="rate_asc">Rate ↑</ToggleButton>
       <ToggleButton value="rate_desc">Rate ↓</ToggleButton>
      </ToggleButtonGroup>
     </Box>
    </Box>

    {loading && (
     <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress size={60} />
     </Box>
    )}

    {error && (
     <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
      {error}
     </Alert>
    )}


    <Grid container spacing={4} justifyContent="center">
     {paged.length > 0 ? (
      paged.map(slot => (
       <Grid item xs={12} sm={6} md={4} key={slot.id}>
        <Card
         data-testid={`slot-item-${slot.slotNumber}`}
         sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          color: 'text.primary',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          '&:hover': {
           transform: 'translateY(-8px)',
           boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
          }
         }}
        >
         <CardContent sx={{ flexGrow: 1, p: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
           <Box sx={{ 
            p: 2, 
            borderRadius: '50%', 
            background: getSlotColor(slot.slotType),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
           }}>
            {getSlotIcon(slot.slotType)}
           </Box>
          </Box>
          
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1f2937' }}>
           Slot {slot.slotNumber}
          </Typography>
          
          <Chip 
           label={slot.slotType} 
           sx={{ 
            mb: 3, 
            background: getSlotColor(slot.slotType),
            color: 'white',
            fontWeight: 600,
            px: 2,
            py: 1
           }} 
          />
          
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, color: '#1976d2' }}>
           ${slot.hourlyRate}/hour
          </Typography>

         

          <Button
           data-testid={`book-btn-${slot.slotNumber}`}
           variant="contained"
           fullWidth
           size="large"
           onClick={() => onSelect(slot)}
           disabled={selectedSlot && selectedSlot.id === slot.id}
           sx={{
            background: selectedSlot && selectedSlot.id === slot.id 
             ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
             : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            fontWeight: 700,
            py: 2,
            borderRadius: 2,
            fontSize: '1.1rem',
            '&:hover': {
             background: selectedSlot && selectedSlot.id === slot.id 
              ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
              : 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
             transform: 'translateY(-2px)'
            },
            '&:disabled': {
             background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
             color: 'white'
            }
           }}
          >
           {selectedSlot && selectedSlot.id === slot.id ? '✓ Selected' : 'Book Now'}
          </Button>
         </CardContent>
        </Card>
       </Grid>
      ))
     ) : (
      !loading && (
       <Grid item xs={12}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
         <DirectionsCar sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
         <Typography variant="h6" color="text.secondary">
          No Slots Available
         </Typography>
         <Typography variant="body2" color="text.secondary">
          Please try adjusting your filters or check back later
         </Typography>
        </Box>
       </Grid>
      )
     )}
    </Grid>

   

{displayed.length > pageSize && (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    mt: 6,
    py: 3,
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: 3,
    border: '1px solid #dee2e6'
  }}>
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}>
        Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, displayed.length)} of {displayed.length} slots
      </Typography>
      <Pagination 
        count={totalPages} 
        page={page} 
        onChange={(e, v) => setPage(v)} 
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            fontSize: '1.1rem',
            fontWeight: 600,
            minWidth: 44,
            height: 44
          }
        }}
      />
    </Box>
  </Box>
)}
  
    </Paper>
   </Container>
  </Box>
 );
}
