import { Box, Skeleton } from '@mui/material';

function FakeLanding() {

  return (
    <Box sx = {{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        pt: "68.5px"
    }}>
        <Box sx = {{pb: 1, pt: 6}}>
            <Skeleton 
                variant="rounded" 
                width={860} 
                height={80} 
            />
        </Box>

        <Skeleton 
            variant="rounded" 
            width={700} 
            height={56} 
        />
        <Skeleton 
            variant="rounded" 
            width={183} 
            height={36.5} 
        />
    </Box>
  );
}

export default FakeLanding;