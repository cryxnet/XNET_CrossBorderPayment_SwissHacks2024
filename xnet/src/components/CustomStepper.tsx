import * as React from 'react';
import { styled, keyframes } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import ConfettiExplosion from "react-confetti-explosion";

const blueGradient = 'linear-gradient( 136deg, rgb(33,150,243) 0%, rgb(30,87,255) 50%, rgb(0,70,150) 100%)';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#4A90E2',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#4A90E2',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: blueGradient,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: blueGradient,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const successAnimation = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.5s ease-in-out',
    ...(ownerState.active && {
        backgroundImage: blueGradient,
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        animation: `${pulse} 1.5s infinite`,
    }),
    ...(ownerState.completed && {
        backgroundImage: blueGradient,
    }),
}));

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <MonetizationOnIcon />,
        2: <SwapHorizIcon />,
        3: <SendIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

const steps = ['Tokenization', 'Swap', 'Transfer'];

export default function CustomStepper({loading}) {
    const [activeStep, setActiveStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (activeStep < steps.length - 1) {
            const timer = setInterval(() => {
                setActiveStep((prevStep) => (prevStep < steps.length - 1 ? prevStep + 1 : prevStep));
            }, 2000);
            return () => clearInterval(timer);
        } else {
            const timer = setTimeout(() => {
                setShowSuccess(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [activeStep]);

    return (
        <div >
            {!loading ? (
                <div style={{ textAlign: 'center', animation: `${successAnimation} 1s ease-in-out` }}>
                    <CheckCircleIcon style={{ fontSize: 50, color: 'green' }} />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                        Transaction completed
                    </Typography>
                    <ConfettiExplosion zIndex={50}/>
                </div>
            ) : (
                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            )}
        </div>
    );
}