import { Button, Grid } from '@material-ui/core';
import { DropzoneArea, DropzoneDialog } from 'material-ui-dropzone';
import React, { useRef, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import Axios from '../Axios/AxiosComponent';
import Plot from 'react-plotly.js';

const uploadUrl = 'http://127.0.0.1:8080/upload'

const useStyles = makeStyles(theme => createStyles({
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
    fullWidth: {
        width: 100,
    }
}));

export default function Upload() {
    const [state, setState] = useState({ scatter_x: [], scatter_y: [], line_x: [], line_y: [], coeff: undefined, intecept: undefined, display: false, file_selcted: false});
    const fileSelected = useRef({fileName : [], fileCount : 0});
    const classes = useStyles();

    const fileToUpload = (e) => {
        fileSelected.current = { fileName: e, fileCount: e.length };
        console.log(fileSelected.current);
        setState({...state, file_selcted: fileSelected.current.fileCount === 0})
    }

    const uploadFile = async () => {
        if (fileSelected.current !== undefined) {
            let formData = new FormData();
            for (let file in fileSelected.current.fileName) {
                formData.append('data_file', fileSelected.current.fileName[file], fileSelected.current.fileName[file].name);
            }
            //let response = await uploadFileToServer(uploadUrl, formData);
            let response = await axios.post(uploadUrl, formData, { headers: { "Content-Type": "multipart/form-data" } });
            console.log(response);
            if (response.status === 200) {
                setTimeout(async ()=> {
                    let graphComponent = await Axios.get('/graph_data');
                    console.log(graphComponent.data);
                    setState({
                        ...state,
                        scatter_x: graphComponent.data.x,
                        scatter_y: graphComponent.data.y,
                        line_x: graphComponent.data.line.x,
                        line_y: graphComponent.data.line.y,
                        coeff: graphComponent.data.coef,
                        intecept: graphComponent.data.intercept,
                        display: true
                    })
                }, 1000);
            }

        }
    };
    return (
        <>
            <Grid container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={5}
            >
                <Grid item xs={12}>
                    <DropzoneArea
                        className={classes.fullWidth}
                        showPreviews={true}
                        showPreviewsInDropzone={false}
                        useChipsForPreview
                        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                        previewChipProps={{ classes: { root: classes.previewChip } }}
                        previewText="Selected files"
                        acceptedFiles={[".csv"]}
                        onChange={fileToUpload}
                        filesLimit={1}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={uploadFile}
                        disabled = {state.file_selcted}
                    >
                        Upload
                    </Button>
                </Grid>
            </Grid>
            {state.display &&
                <>
                <h3>Coefficient: {state.coeff.toFixed(3)}</h3>
                <h3>Intercept: {state.intecept.toFixed(3)}</h3>
                <Plot
                    data={[
                        {
                            x: state.scatter_x,
                            y: state.scatter_y,
                            type: 'scatter',
                            mode: 'markers',
                            marker: { color: 'red' },
                            name: 'input_data'
                        },
                        { type: 'line', x: state.line_x, y: state.line_y , name: 'fitted_data', line: {color: 'blue'}},
                    ]}
                    layout={{ width: 800, height: 800, title: 'Fitted Data' }}
                />
                </>
            }

        </>
    )
};