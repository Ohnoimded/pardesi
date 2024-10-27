import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const NotFound = () => {

    return (
        <>
        <div className='flex'>
            {/* <h1>404: NEEDS A BIT OF DESIGNING??</h1> */}
            <p >404:Page Not Found</p>
        </div>
        </>
    );
};

export default NotFound;
