
'use client'; 

import Link from 'next/link';
import React, { useState } from 'react'; // Necesitamos useState para el hover

// Definición de colores base (simulando la marca Hipermaxi)
const COLORS = {
    primaryRed: '#E3001B', // Un rojo intenso
    secondaryWhite: '#FFFFFF',
    textDark: '#333333',
    backgroundLight: '#F7F7F7',
    hoverRed: '#C50017' // Rojo más oscuro para el hover
};

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.backgroundLight,
        padding: '20px',
    },
    card: {
        backgroundColor: COLORS.secondaryWhite,
        padding: '40px 60px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
    },
    logoContainer: {
        marginBottom: '25px',
    },
    logoText: {
        fontSize: '2.5em',
        fontWeight: '900',
        color: COLORS.primaryRed,
        borderBottom: `5px solid ${COLORS.primaryRed}`,
        display: 'inline-block',
        lineHeight: '1',
        paddingBottom: '5px',
    },
    title: {
        fontSize: '1.5em',
        color: COLORS.textDark,
        marginBottom: '15px',
    },
    description: {
        color: COLORS.textDark,
        marginBottom: '30px',
        lineHeight: '1.6',
    },
    buttonBase: { // Estilos base del botón
        display: 'block',
        width: '100%',
        padding: '15px',
        backgroundColor: COLORS.primaryRed,
        color: COLORS.secondaryWhite,
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none',
        boxShadow: '0 2px 8px rgba(227, 0, 27, 0.4)',
    },
};

export default function Home() {
    const [isHovered, setIsHovered] = useState(false);

    // Combina el estilo base con el estilo de hover si es necesario
    const buttonStyle = {
        ...styles.buttonBase,
        backgroundColor: isHovered ? COLORS.hoverRed : COLORS.primaryRed,
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                
                <div style={styles.logoContainer}>
                    <h1 style={styles.logoText}>HIPERMAXI</h1>
                </div>
                <Link 
                    href="/planificador" 
                    style={buttonStyle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    INICIAR 
                </Link>
            </div>
        </div>
    );
}