import logo from './logo.svg';
import './App.css';
import { Grid, Typography } from '@material-ui/core';
import Upload from './components/Upload/Upload';

function App() {
  return (
    <>
      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Typography style={{fontSize: "24px", fontWeight: 600}}>Demo App</Typography>
        </Grid>
      </Grid>
      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Upload/>
        </Grid>
      </Grid>
    </>
    
  );
}

export default App;
