import React, { useEffect, useState } from 'react';

import {
  Box,
  Grid,
  Typography,
  Link,
  Paper,
  Pagination,
  Stack,
} from '@mui/material';

export default function OperatorViewer(props) {
  const [operatorNumber, setOperatorNumber] = useState(1);

  const [operator, setOperator] = useState('Loading ... ');

  const changeOperator = (event, value) => {
    setOperatorNumber(value);
  };

  useEffect(() => {
    if (props.operators[operatorNumber - 1] !== undefined) {
      setOperator(props.operators[operatorNumber - 1]);
    }
  }, [operatorNumber, props.operators]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container style={{ width: '100%' }}>
        {/* Component Title */}
        <Grid item xs={12}>
          <Typography
            component="div"
            variant="h5"
            sx={{ ml: { xs: '5%', sm: '2.5%' } }}
          >
            Operator Sequence
          </Typography>
        </Grid>

        <Grid item xs={12} mt={1}>
          {/* Container */}
          <Paper elevation={0} sx={{ padding: 3 }}>
            {/* Reference & Method */}
            <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
              <Typography display="block" sx={{ fontSize: { xs: 12, sm: 16 } }}>
                Reference:&nbsp;
                <Link
                  href={'https://doi.org/' + operator['doi']}
                  target="blank"
                >
                  {operator['ref_figure']}
                </Link>
              </Typography>
            </Box>

            <Box
              display="flex"
              mb={2}
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Typography display="block" sx={{ fontSize: { xs: 12, sm: 16 } }}>
                Method: {operator['method']}
              </Typography>
            </Box>

            {/* Operator Sequence */}
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  component="div"
                  sx={{
                    textAlign: 'center',
                    overflowX: 'scroll',
                    fontSize: { xs: 18, sm: 26 },
                  }}
                >
                  {operator['sequence']}
                </Typography>
              </Grid>

              {/* Pagination */}
              {props.operators.length > 1 ? (
                <Grid item xs={12} mt={3}>
                  <Stack spacing={2} alignItems="center">
                    <Pagination
                      count={props.operators.length}
                      page={operatorNumber}
                      onChange={changeOperator}
                      size="small"
                    />
                  </Stack>
                </Grid>
              ) : (
                <div></div>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>

    // <Col>
    //     <h3 style={{opacity:"60%", width:"100vw"}}>Operator Sequence</h3>

    //     <Card className="card-body bg-light" >

    //         <Row>

    //             <Col lg={{span:8}} s={{span: 12}} >
    //             <Card className="card-body" style={{textAlign: "center", fontSize:"24px", overflowX: "scroll", whiteSpace: "nowrap", height: "100px"}}>
    //                 {operator["sequence"]}
    //             </Card>
    //             </Col>

    //             <Col lg={{span:4}} s={{span: 12}}>
    //             <Card className="card-body" style={{height: "100px"}}>
    //                 <h5>Reference: <a href={"https://doi.org/"+operator["doi"]} target="blank" style={{textDecoration: "none"}}>{operator["ref_figure"]} </a></h5>
    //                 <h5>Method: {operator["method"]}</h5>
    //             </Card>

    //             </Col>

    //         </Row>

    //     </Card>

    //     {switchOperator}

    // </Col>
  );
}
